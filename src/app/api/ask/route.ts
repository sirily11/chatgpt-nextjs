import chatgptQuery from '@/api/chatgptApi/queryApi';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
  prompt: z.string(),
  parentMessageId: z.any()
});

export async function POST(request: Request) {
  const data = await request.json();
  const { prompt, parentMessageId } = RequestSchema.parse(data);

  const result = await chatgptQuery(prompt, parentMessageId);

  return NextResponse.json({
    result
  });
}
