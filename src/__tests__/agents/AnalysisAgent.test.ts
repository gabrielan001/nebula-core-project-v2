import { AnalysisAgent } from '../../agents/AnalysisAgent';

describe('AnalysisAgent', () => {
  test('analysis returns json with issues array when successful', async () => {
    const agent = new AnalysisAgent();
    const result = await agent.run({ scope: 'ui' });
    
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('data');
    expect(Array.isArray(result.data.issues)).toBe(true);
  });

  test('handles different scopes', async () => {
    const agent = new AnalysisAgent();
    const result = await agent.run({ scope: 'backend' });
    
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('data.issues');
  });
});
