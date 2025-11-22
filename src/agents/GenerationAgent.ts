import { AgentBase } from '../base/AgentBase';
import { z } from 'zod';
import { OpenAI } from 'openai';

const schema = z.object({
  task: z.string(),
  files: z.array(z.object({ path: z.string(), content: z.string().optional() })).optional(),
});

type Output = { 
  files: Array<{ path: string; content: string }>; 
  changelog: string[] 
};

const SYSTEM_PROMPT = `You are a code generation assistant. Your task is to help generate and modify files based on the given requirements.

Your output must be a valid JSON object with the following structure:
{
  "files": [
    {
      "path": "path/to/file",
      "content": "file content here"
    }
  ],
  "changelog": [
    "Created new file at path/to/file",
    "Updated existing file at path/to/another"
  ]
}`;

export class GenerationAgent extends AgentBase<typeof schema, Output> {
  private openai: OpenAI;

  constructor(apiKey: string) { 
    super(schema, SYSTEM_PROMPT);
    this.openai = new OpenAI({ apiKey });
  }
  
  protected async generateOutput(input: z.infer<typeof schema>): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: JSON.stringify(input) }
        ],
        temperature: 0.2,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating output:', error);
      return JSON.stringify({
        files: [],
        changelog: ['Failed to generate output. Please try again.']
      });
    }
  }

  protected parseOutput(raw: string): Output {
    try { 
      return JSON.parse(raw); 
    } catch (e) { 
      console.error('Failed to parse LLM output:', e);
      return { 
        files: [], 
        changelog: ['Failed to parse LLM output. Please ensure the response is valid JSON.'] 
      }; 
    }
  }
}
