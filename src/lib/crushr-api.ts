import { supabase } from './supabase';

export type GenerateContentType = 'romantic_message' | 'love_letter' | 'pickup_line';

export interface GenerateContentInput {
  type?: GenerateContentType;
  context?: string;
  tone?: string;
  recipientName?: string;
}

export async function generateMessageContent(input: GenerateContentInput) {
  const { data, error } = await supabase.functions.invoke<{ content: string }>('generate-content', {
    body: {
      type: input.type ?? 'romantic_message',
      context: input.context ?? 'A warm, playful message for a crush.',
      tone: input.tone ?? 'sweet',
      recipientName: input.recipientName ?? 'you',
    },
  });

  if (error) {
    throw error;
  }

  return data?.content ?? 'No content returned.';
}
