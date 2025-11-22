import { runOrchestration } from './Orchestrator';
import { AnalysisAgent } from '../analysis';
import { GenerationAgent } from '../generation';
import { TrackingAgent } from '../tracking';
import { MultichannelAgent } from '../multichannel';
import { Logger } from '../../lib/logger';

// Mock the logger to prevent actual logging during tests
jest.mock('../../lib/logger', () => ({
  child: jest.fn().mockReturnValue({
    info: jest.fn(),
    error: jest.fn()
  })
}));

// Mock the agent classes
jest.mock('../analysis', () => ({
  AnalysisAgent: jest.fn().mockImplementation(() => ({
    run: jest.fn()
  }))
}));

jest.mock('../generation', () => ({
  GenerationAgent: jest.fn().mockImplementation(() => ({
    run: jest.fn()
  }))
}));

jest.mock('../tracking', () => ({
  TrackingAgent: jest.fn().mockImplementation(() => ({
    run: jest.fn()
  }))
}));

jest.mock('../multichannel', () => ({
  MultichannelAgent: jest.fn().mockImplementation(() => ({
    run: jest.fn()
  }))
}));

describe('runOrchestration', () => {
  const mockAnalysis = { success: true, data: { insights: ['test'] } };
  const mockPlan = { data: { channels: ['web', 'mobile'] } };
  const mockGeneration = { data: { files: ['index.html', 'styles.css'] } };
  const mockTracking = { data: { events: ['pageView', 'lead'] } };
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (AnalysisAgent as jest.Mock).mockImplementation(() => ({
      run: jest.fn().mockResolvedValue(mockAnalysis)
    }));
    
    (MultichannelAgent as jest.Mock).mockImplementation(() => ({
      run: jest.fn().mockResolvedValue(mockPlan)
    }));
    
    (GenerationAgent as jest.Mock).mockImplementation(() => ({
      run: jest.fn().mockResolvedValue(mockGeneration)
    }));
    
    (TrackingAgent as jest.Mock).mockImplementation(() => ({
      run: jest.fn().mockResolvedValue(mockTracking)
    }));
  });

  it('should successfully orchestrate the full flow', async () => {
    const goal = {
      intent: 'test campaign',
      context: {
        icp: 'test-icp',
        budget: 5000
      }
    };

    const result = await runOrchestration(goal);

    // Verify the final result structure
    expect(result).toEqual({
      analysis: mockAnalysis.data,
      plan: mockPlan.data,
      files: mockGeneration.data.files,
      tracking: mockTracking.data
    });

    // Verify AnalysisAgent was called correctly
    const analysisInstance = (AnalysisAgent as jest.Mock).mock.instances[0];
    expect(analysisInstance.run).toHaveBeenCalledWith({ scope: 'full' });

    // Verify MultichannelAgent was called with correct parameters
    const multichannelInstance = (MultichannelAgent as jest.Mock).mock.instances[0];
    expect(multichannelInstance.run).toHaveBeenCalledWith({
      icp: goal.context.icp,
      budget: goal.context.budget
    });

    // Verify GenerationAgent was called with correct task
    const generationInstance = (GenerationAgent as jest.Mock).mock.instances[0];
    expect(generationInstance.run).toHaveBeenCalledWith({
      task: `Create landing hero and dataLayer for ${goal.intent}`
    });

    // Verify TrackingAgent was called with correct pages and goals
    const trackingInstance = (TrackingAgent as jest.Mock).mock.instances[0];
    expect(trackingInstance.run).toHaveBeenCalledWith({
      pages: ['/', '/pricing'],
      goals: ['lead']
    });
  });

  it('should use default budget when not provided', async () => {
    const goal = {
      intent: 'test campaign',
      context: { icp: 'test-icp' }
    };

    await runOrchestration(goal as any);

    const multichannelInstance = (MultichannelAgent as jest.Mock).mock.instances[0];
    expect(multichannelInstance.run).toHaveBeenCalledWith({
      icp: 'test-icp',
      budget: 10000  // Default budget
    });
  });

  it('should throw an error when analysis fails', async () => {
    // Override the AnalysisAgent mock to simulate failure
    (AnalysisAgent as jest.Mock).mockImplementationOnce(() => ({
      run: jest.fn().mockResolvedValue({
        success: false,
        error: 'Analysis failed'
      })
    }));

    await expect(runOrchestration({ intent: 'test' }))
      .rejects
      .toThrow('analysis failed: Analysis failed');
  });

  it('should work with minimal input', async () => {
    const goal = { intent: 'minimal test' };
    
    await expect(runOrchestration(goal)).resolves.toBeDefined();
    
    // Verify multichannel agent was called with undefined icp and default budget
    const multichannelInstance = (MultichannelAgent as jest.Mock).mock.instances[0];
    expect(multichannelInstance.run).toHaveBeenCalledWith({
      icp: undefined,
      budget: 10000
    });
  });
});
