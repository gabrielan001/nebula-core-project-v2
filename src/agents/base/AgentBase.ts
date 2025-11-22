import { z } from 'zod';

// Simple logger implementation if not already available
class Logger {
  static child(context: Record<string, any>) {
    return {
      debug: (message: string, data?: any) => 
        console.debug(`[DEBUG] ${message}`, data || ''),
      error: (message: string, data?: any) => 
        console.error(`[ERROR] ${message}`, data || '')
    };
  }
}

// Simple LLM client implementation
async function callLLM(messages: Array<{ role: string; content: string }>): Promise<string> {
  // In a real implementation, this would call your LLM provider
  console.log('Calling LLM with messages:', messages);
  // Mock response - in a real implementation, this would be the actual LLM response
  return JSON.stringify({
    sentiment: 'positive',
    confidence: 0.92,
    explanation: 'The text expresses strong positive sentiment.'
  });
}

export type AgentResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export abstract class AgentBase<I extends z.ZodTypeAny, O> {
  protected logger = Logger.child({ agent: this.constructor.name });

  constructor(protected inputSchema: I, protected systemPrompt: string) {}

  protected validate(input: unknown) {
    return this.inputSchema.parse(input);
  }

  protected async llmCall(messages: Array<{ role: string; content: string }>) {
    return callLLM(messages);
  }

  public async run(input: unknown): Promise<AgentResult<O>> {
    try {
      const parsed = this.validate(input);
      this.logger.debug('Validated input', { parsed });
      const messages = [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: JSON.stringify(parsed) },
      ];
      const raw = await this.llmCall(messages);
      const parsedOut = this.parseOutput(raw);
      return { success: true, data: parsedOut };
    } catch (err: any) {
      this.logger.error('Agent run failed', { error: err });
      return { 
        success: false, 
        error: err instanceof Error ? err.message : String(err) 
      };
    }
  }

  protected abstract parseOutput(raw: string): O;
}
