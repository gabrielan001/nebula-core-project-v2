import { z, ZodTypeAny } from 'zod';

export abstract class AgentBase<T extends ZodTypeAny, U> {
  protected schema: T;
  protected systemPrompt: string;

  constructor(schema: T, systemPrompt: string) {
    this.schema = schema;
    this.systemPrompt = systemPrompt;
  }

  /**
   * Validates the input against the schema
   */
  protected validateInput(input: unknown): z.infer<T> {
    return this.schema.parse(input);
  }

  /**
   * Processes the input and returns the output
   */
  public async process(input: unknown): Promise<U> {
    const validatedInput = this.validateInput(input);
    const rawOutput = await this.generateOutput(validatedInput);
    return this.parseOutput(rawOutput);
  }

  /**
   * Abstract method to be implemented by child classes
   * Handles the actual generation of output based on input
   */
  protected abstract generateOutput(input: z.infer<T>): Promise<any>;

  /**
   * Parses the raw output from the LLM into the expected format
   * Can be overridden by child classes for custom parsing
   */
  protected abstract parseOutput(raw: any): U;
}
