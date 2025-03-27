import fetch from 'node-fetch';
import https from 'https';

interface LLMMessage {
  role: string;
  content: string;
}

interface LLMResponse {
  choices: Array<{ delta: { content: string } }>;
}

export class LlavaService {
  private baseUrl: string;
  private httpsAgent: https.Agent;

  constructor(baseUrl: string = 'https://lou87t87gi89.info:4443') {
    this.baseUrl = baseUrl;
    this.httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });
  }

  async* requestCompletion(prompt: string): AsyncGenerator<string> {
    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llava',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      }),
      agent: this.httpsAgent as any
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    // Convert the response body to a string reader
    const reader = response.body;
    let buffer = '';

    for await (const chunk of reader) {
      // Convert Buffer to string directly
      const chunkString = typeof chunk === 'string' 
        ? chunk 
        : Buffer.from(chunk as Buffer).toString('utf-8');
      
      buffer += chunkString;
      let boundary = buffer.indexOf('\n\n');

      while (boundary !== -1) {
        const line = buffer.slice(0, boundary).trim();
        buffer = buffer.slice(boundary + 2);

        if (line.startsWith('data: ')) {
          const json = line.replace(/^data: /, '');
          if (json === '[DONE]') continue;

          try {
            const data: LLMResponse = JSON.parse(json);
            if (data.choices[0]?.delta?.content) {
              yield data.choices[0].delta.content;
            }
          } catch (err) {
            console.error('Error parsing JSON chunk:', err);
          }
        }

        boundary = buffer.indexOf('\n\n');
      }
    }
  }
}