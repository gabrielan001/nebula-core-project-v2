import { NextResponse } from 'next/server';
import { runOrchestration } from '@/agents/orchestrator';

const API_KEYS = new Set([
  process.env.API_KEY_1,
  process.env.API_KEY_2,
].filter(Boolean));

function authenticateApiKey(authHeader: string | null): boolean {
  if (!authHeader) return false;
  
  const [scheme, apiKey] = authHeader.split(' ');
  return scheme === 'Bearer' && API_KEYS.has(apiKey);
}

export async function POST(req: Request) {
  // Check API key
  const authHeader = req.headers.get('authorization');
  if (!authenticateApiKey(authHeader)) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }), 
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const payload = await req.json();
    
    if (!payload) {
      return new NextResponse(
        JSON.stringify({ error: 'Request body is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const result = await runOrchestration(payload);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Orchestration error:', error);
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    
    return new NextResponse(
      JSON.stringify({ 
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }), 
      { 
        status: statusCode, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}

// Return 405 for non-POST methods
export function GET() {
  return new NextResponse(
    JSON.stringify({ error: 'Method not allowed' }), 
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
}
