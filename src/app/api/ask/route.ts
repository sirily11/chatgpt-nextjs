import chatgptQuery from '@/api/chatgptApi/queryApi';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  const { prompt, parentMessageId } = data;

  const result = await chatgptQuery(prompt, parentMessageId);

  return NextResponse.json({
    result
  });
}
