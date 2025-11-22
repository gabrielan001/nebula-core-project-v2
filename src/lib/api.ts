interface ApiResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  success: boolean;
}

export async function callOrchestrator<T = any>(
  payload: any,
  options: {
    headers?: Record<string, string>;
    signal?: AbortSignal;
  } = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch('/api/orchestrator/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: JSON.stringify(payload),
      signal: options.signal || controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      data,
      success: true,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      return {
        error: {
          message: error.message,
          code: error.name === 'AbortError' ? 'TIMEOUT' : 'API_ERROR',
        },
        success: false,
      };
    }

    return {
      error: {
        message: 'An unknown error occurred',
        code: 'UNKNOWN_ERROR',
      },
      success: false,
    };
  }
}

// Example usage with TypeScript types:
/*
interface UserData {
  id: string;
  name: string;
}

const result = await callOrchestrator<UserData>({ userId: '123' });
if (result.success) {
  console.log('User data:', result.data); // TypeScript knows this is UserData
} else {
  console.error('Error:', result.error?.message);
}
*/
