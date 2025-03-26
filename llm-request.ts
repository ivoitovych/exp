import fetch from 'node-fetch';
import { ReadableStream } from 'web-streams-polyfill';

interface LLMMessage {
  role: string;
  content: string;
}

interface LLMResponse {
  choices: Array<{ delta: { content: string } }>;
}

async function* requestCompletion(prompt: string): AsyncIterable<string> {
  const response = await fetch('https://lou87t87gi89.info:4443/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llava',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  const decoder = new TextDecoder();
  const reader = (response.body as unknown as ReadableStream<Uint8Array>).getReader();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let boundary = buffer.indexOf('\n\n');
    while (boundary !== -1) {
      const chunk = buffer.slice(0, boundary).trim();
      buffer = buffer.slice(boundary + 2);

      if (chunk.startsWith('data: ')) {
        const json = chunk.replace(/^data: /, '');
        try {
          const data: LLMResponse = JSON.parse(json);
          yield data.choices[0].delta.content;
        } catch (err) {
          console.error('Error parsing JSON chunk:', err);
        }
      }
      boundary = buffer.indexOf('\n\n');
    }
  }
}

// Usage example
(async () => {
  const prompt = 'What is an apple?';

  for await (const part of requestCompletion(prompt)) {
    process.stdout.write(part + ' ');
  }
})();

