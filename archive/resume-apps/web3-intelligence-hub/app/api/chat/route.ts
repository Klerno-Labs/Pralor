import { NextRequest } from 'next/server';
import { getOpenAIClient, CRYPTO_RESEARCH_SYSTEM_PROMPT, parseStructuredResponse } from '@/lib/research/openai';
import { ChatRequest } from '@/lib/research/types';

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as ChatRequest;

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare messages with system prompt
    const chatMessages = [
      {
        role: 'system' as const,
        content: CRYPTO_RESEARCH_SYSTEM_PROMPT,
      },
      ...messages,
    ];

    // Call OpenAI API with streaming
    const openai = getOpenAIClient();
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    });

    // Create a readable stream
    const encoder = new TextEncoder();
    let fullContent = '';

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullContent += content;
              // Send the chunk
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }

          // Parse and send the final structured response
          const structuredResponse = parseStructuredResponse(fullContent);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                done: true,
                structuredResponse,
                fullContent
              })}\n\n`
            )
          );
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
