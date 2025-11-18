import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Models that support temperature parameter
const MODELS_WITH_TEMPERATURE = [
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4-turbo',
  'gpt-4',
  'gpt-3.5-turbo'
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract and verify JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Missing authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client for auth verification
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify the user's JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use authenticated user's ID (prevent impersonation)
    const userId = user.id;

    const { agentId, message } = await req.json();
    
    // Validate required fields
    if (!agentId || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate message format and length
    if (typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Message cannot be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (message.length > 4000) {
      return new Response(
        JSON.stringify({ error: 'Message too long (max 4000 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate UUID formats
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(agentId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid agent ID format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPEN_AI_TOKEN');
    if (!OPENAI_API_KEY) {
      console.error('OPEN_AI_TOKEN not found in environment');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get agent configuration
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (agentError || !agent) {
      console.error('Agent not found:', agentError);
      return new Response(
        JSON.stringify({ error: 'Agent not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user profile to check plan - SECURITY: Always fetch from database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('plan, firstname, lastname')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Profile not found:', profileError);
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userPlan = profile.plan || 'free';
    const userName = `${profile.firstname} ${profile.lastname}`.trim();
    console.log('User plan:', userPlan, 'Name:', userName);

    // Save user message
    const { error: saveError } = await supabase
      .from('agent_messages')
      .insert({
        user_id: userId,
        agent_id: agentId,
        message: message,
        writer: 'user'
      });

    if (saveError) {
      console.error('Error saving user message:', saveError);
    }

    // Get last 50 messages for context
    const { data: previousMessages } = await supabase
      .from('agent_messages')
      .select('*')
      .eq('user_id', userId)
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(50);

    // Build conversation history (reverse to get chronological order)
    const conversationHistory = (previousMessages || [])
      .reverse()
      .map(msg => ({
        role: msg.writer === 'user' ? 'user' : 'assistant',
        content: msg.message
      }));

    // SECURITY: Inject user plan and name into system prompt (prevent user fraud)
    const enhancedPrompt = `${agent.prompt || 'You are a helpful assistant.'}

INFORMAÇÕES DO USUÁRIO (NÃO PERGUNTE ISSO):
- Nome: ${userName}
- Plano contratado: ${userPlan.toUpperCase()}
- IMPORTANTE: O usuário está no plano ${userPlan.toUpperCase()}. Ajuste suas respostas e funcionalidades de acordo com o plano dele. Não pergunte qual plano ele tem, você já sabe.`;

    // Prepare OpenAI request
    const messages = [
      { role: 'system', content: enhancedPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Build request body based on model temperature support
    const supportsTemperature = MODELS_WITH_TEMPERATURE.includes(agent.model);
    const requestBody: any = {
      model: agent.model,
      messages: messages,
      stream: true,
    };

    if (supportsTemperature && agent.temperature !== null) {
      requestBody.temperature = agent.temperature;
    }

    console.log('Calling OpenAI with model:', agent.model, 'Temperature:', supportsTemperature ? agent.temperature : 'not supported');

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return new Response(
        JSON.stringify({ error: 'OpenAI API error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Stream the response
    const reader = response.body?.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let fullResponse = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader!.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  
                  if (content) {
                    fullResponse += content;
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch (e) {
                  console.error('Error parsing chunk:', e);
                }
              }
            }
          }

          // Add upgrade cards for free plan users
          if (userPlan === 'free' && fullResponse) {
            const upgradeCards = `

---

## 🚀 Quer Desbloquear Todo o Potencial?

### 🚀 Plano Premium
**R$ 29,90/mês**

✅ Score detalhado com 5 pilares  
✅ Conversas ilimitadas  
✅ Produtos específicos por patrimônio  
✅ Planos de ação personalizados  
✅ Casos familiares básicos  

[🎯 ASSINAR PREMIUM](https://pay.kiwify.com.br/seu-link-premium)

---

### 💎 Plano Enterprise
**R$ 97/mês**

✅ Tudo do Premium +  
✅ Relatórios de evolução patrimonial  
✅ Simulações de aposentadoria avançadas  
✅ Múltiplos cenários financeiros  
✅ Suporte prioritário  

[💼 ASSINAR ENTERPRISE](https://pay.kiwify.com.br/seu-link-enterprise)

---`;

            // Stream the upgrade cards
            const upgradeLines = upgradeCards.split('\n');
            for (const line of upgradeLines) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: line + '\n' })}\n\n`));
            }
            
            fullResponse += upgradeCards;
          }

          // Save assistant response (with upgrade cards if applicable)
          if (fullResponse) {
            await supabase
              .from('agent_messages')
              .insert({
                user_id: userId,
                agent_id: agentId,
                message: fullResponse,
                writer: 'assistant'
              });
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in chat-agent function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});