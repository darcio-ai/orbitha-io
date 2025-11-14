-- Create enum for message writer
CREATE TYPE public.message_writer AS ENUM ('user', 'assistant');

-- Create agent_messages table
CREATE TABLE public.agent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  writer message_writer NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_agent_messages_user_agent ON public.agent_messages(user_id, agent_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;

-- Users can view their own messages
CREATE POLICY "Users can view their own messages"
ON public.agent_messages
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own messages
CREATE POLICY "Users can insert their own messages"
ON public.agent_messages
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_agent_messages_updated_at
BEFORE UPDATE ON public.agent_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();