import { z } from 'zod';
import { AgentBase } from './base/AgentBase';

export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface SentimentAnalysisResult {
  sentiment: Sentiment;
  confidence: number;
  explanation: string;
}

const SentimentAnalysisInput = z.object({
  text: z.string().min(1, 'Text cannot be empty'),
  context: z.string().optional(),
});

export class SentimentAnalyzerAgent extends AgentBase<typeof SentimentAnalysisInput, SentimentAnalysisResult> {
  constructor() {
    const systemPrompt = `You are an advanced sentiment analysis agent. 
    Analyze the sentiment of the provided text and return a valid JSON response with these fields:
    - sentiment: one of 'positive', 'negative', or 'neutral'
    - confidence: a number between 0 and 1
    - explanation: a brief explanation of your analysis
    
    Consider the context if provided, but focus on the main text for sentiment analysis.
    
    Example response:
    {
      "sentiment": "positive",
      "confidence": 0.92,
      "explanation": "The text expresses strong positive sentiment."
    }`;
    
    super(SentimentAnalysisInput, systemPrompt);
  }

  protected parseOutput(raw: string): SentimentAnalysisResult {
    try {
      const result = JSON.parse(raw);
      
      // Basic validation of the LLM output
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response format: expected an object');
      }
      
      const sentiment = result.sentiment?.toLowerCase();
      if (!['positive', 'negative', 'neutral'].includes(sentiment)) {
        throw new Error(`Invalid sentiment value: ${result.sentiment}`);
      }

      const confidence = parseFloat(result.confidence);
      if (isNaN(confidence) || confidence < 0 || confidence > 1) {
        throw new Error(`Confidence must be a number between 0 and 1, got: ${result.confidence}`);
      }

      if (typeof result.explanation !== 'string' || !result.explanation.trim()) {
        throw new Error('Explanation is required');
      }

      return {
        sentiment: sentiment as Sentiment,
        confidence,
        explanation: result.explanation.trim()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Failed to parse sentiment analysis output', { 
        error: errorMessage, 
        raw 
      });
      throw new Error(`Failed to parse sentiment analysis output: ${errorMessage}`);
    }
  }

  // Convenience method for direct text analysis
  public async analyzeText(text: string, context?: string): Promise<SentimentAnalysisResult> {
    const result = await this.run({ text, context });
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Sentiment analysis failed');
    }
    return result.data;
  }
}

// Example usage:
/*
async function example() {
  const analyzer = new SentimentAnalyzerAgent();
  
  // Basic usage
  const result1 = await analyzer.analyzeText('I love this product!');
  console.log(result1);
  
  // With context
  const result2 = await analyzer.analyzeText(
    'This is not bad at all!",
    "The user is typically very critical"
  );
  console.log(result2);
}
*/
