import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 60 * 1000);

// Input validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email && typeof email === 'string' && email.length <= 255 && emailRegex.test(email);
}

function sanitizeString(str: string, maxLength: number): string {
  if (!str || typeof str !== 'string') return '';
  return str.trim().substring(0, maxLength).replace(/<[^>]*>/g, '');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    if (isRateLimited(clientIP)) {
      console.log(`Rate limit exceeded for contact form`);
      return new Response(
        JSON.stringify({ error: 'Muitas tentativas. Aguarde um minuto antes de enviar novamente.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { name, email, company, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Nome, email e mensagem são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Email inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeString(name, 100),
      email: sanitizeString(email, 255),
      company: sanitizeString(company || '', 100),
      phone: sanitizeString(phone || '', 20),
      message: sanitizeString(message, 1000),
    };

    // Validate message length
    if (sanitizedData.message.length < 10) {
      return new Response(
        JSON.stringify({ error: 'Mensagem muito curta (mínimo 10 caracteres)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save contact message to database
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name: sanitizedData.name,
        email: sanitizedData.email,
        company: sanitizedData.company || null,
        phone: sanitizedData.phone || null,
        message: sanitizedData.message,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving contact message:', error);
      return new Response(
        JSON.stringify({ error: 'Erro ao enviar mensagem. Tente novamente.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Contact message saved successfully with ID:', data.id);

    // Send email notification via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      
      try {
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">📩 Nova Mensagem de Contato</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Recebida através do site Orbitha</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Nome</strong><br>
                    <span style="font-size: 16px; color: #1e293b;">${sanitizedData.name}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Email</strong><br>
                    <a href="mailto:${sanitizedData.email}" style="font-size: 16px; color: #6366f1; text-decoration: none;">${sanitizedData.email}</a>
                  </td>
                </tr>
                ${sanitizedData.company ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Empresa</strong><br>
                    <span style="font-size: 16px; color: #1e293b;">${sanitizedData.company}</span>
                  </td>
                </tr>
                ` : ''}
                ${sanitizedData.phone ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">WhatsApp</strong><br>
                    <a href="https://wa.me/${sanitizedData.phone.replace(/\D/g, '')}" style="font-size: 16px; color: #6366f1; text-decoration: none;">${sanitizedData.phone}</a>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 12px 0;">
                    <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Mensagem</strong><br>
                    <div style="background: white; padding: 16px; border-radius: 8px; margin-top: 8px; border: 1px solid #e2e8f0;">
                      <p style="margin: 0; font-size: 15px; color: #1e293b; white-space: pre-wrap;">${sanitizedData.message}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="background: #1e293b; padding: 20px 30px; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="color: #94a3b8; margin: 0; font-size: 13px;">
                Mensagem enviada em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
              </p>
            </div>
          </body>
          </html>
        `;

        const emailResponse = await resend.emails.send({
          from: 'Orbitha Contato <onboarding@resend.dev>',
          to: ['contato@orbitha.io'],
          subject: `Nova mensagem de contato: ${sanitizedData.name}`,
          html: emailHtml,
          reply_to: sanitizedData.email,
        });

        console.log('Email sent successfully:', emailResponse);
      } catch (emailError) {
        // Log email error but don't fail the request since message was saved
        console.error('Error sending email notification:', emailError);
      }
    } else {
      console.warn('RESEND_API_KEY not configured, skipping email notification');
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-contact function:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno. Tente novamente mais tarde.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
