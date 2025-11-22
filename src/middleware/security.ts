import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { createClient } from '@supabase/supabase-js';

// Web Crypto API (Edge Runtime compatible)
async function hashString(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Initialize Supabase client for audit logging
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Initialize Redis for rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Create a new ratelimiter, allowing 60 requests per minute per user/team
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  analytics: true,
});

export async function validateApiKey(apiKey: string): Promise<{ isValid: boolean; teamId?: string }> {
  if (!apiKey) return { isValid: false };
  
  // In a real app, you would validate the API key against your database
  // This is a simplified example
  if (!supabase) {
    console.warn('[Supabase] Not configured');
    return { isValid: false };
  }

  const { data, error } = await supabase
    .from('api_keys')
    .select('team_id')
    .eq('key', apiKey)
    .single();

  if (error || !data) {
    return { isValid: false };
  }

  return { isValid: true, teamId: data.team_id };
}

export async function logRequest(
  req: NextRequest,
  response: NextResponse,
  metadata: { teamId?: string; userId?: string } = {}
) {
  if (!supabase) {
    console.warn('[Supabase] Not configured');
    return;
  }

  try {
    const url = new URL(req.url);
    const requestData = {
      method: req.method,
      path: url.pathname,
      query: Object.fromEntries(url.searchParams.entries()),
      headers: Object.fromEntries(req.headers.entries()),
      team_id: metadata.teamId,
      user_id: metadata.userId,
      response_status: response.status,
      timestamp: new Date().toISOString(),
    };

    await supabase.from('audit_logs').insert(requestData);
  } catch (error) {
    console.error('Error logging request:', error);
  }
}

export async function securityMiddleware(req: NextRequest) {
  const url = new URL(req.url);
  
  // Skip middleware for public routes (adjust as needed)
  if (url.pathname.startsWith('/api/public')) {
    return NextResponse.next();
  }

  // Extract API key from header
  const apiKey = req.headers.get('x-api-key');
  if (!apiKey) {
    return new NextResponse(
      JSON.stringify({ error: 'API key required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Validate API key
  const { isValid, teamId } = await validateApiKey(apiKey);
  if (!isValid || !teamId) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid API key' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Apply rate limiting per team
  const identifier = teamId;
  const result = await ratelimit.limit(identifier);
  
  // Add rate limit headers
  const response = result.success
    ? NextResponse.next()
    : new NextResponse(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );

  response.headers.set('X-RateLimit-Limit', result.limit.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', result.reset.toString());

  // Clone the request to read the body for logging
  const requestClone = req.clone();
  let requestBody = {};
  
  try {
    // Only parse JSON bodies, skip for other content types
    if (requestClone.headers.get('content-type')?.includes('application/json')) {
      requestBody = await requestClone.json().catch(() => ({}));
    }
  } catch (e) {
    console.error('Error parsing request body for logging:', e);
  }

  // Log the request asynchronously to not block the response
  logRequest(
    req,
    response,
    { teamId }
  ).catch(console.error);

  return response;
}

// Utility function to sanitize input
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Basic XSS prevention - in a real app, use a library like DOMPurify
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (input && typeof input === 'object') {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, sanitizeInput(value)])
    );
  }
  
  return input;
}

// Utility to safely handle secrets
export function maskSecrets(data: any, fieldsToMask: string[] = ['password', 'apiKey', 'token']): any {
  if (typeof data === 'string' && fieldsToMask.some(field => field.toLowerCase() === data.toLowerCase())) {
    return '***';
  }
  
  if (Array.isArray(data)) {
    return data.map(item => maskSecrets(item, fieldsToMask));
  }
  
  if (data && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        fieldsToMask.includes(key.toLowerCase()) ? '***' : maskSecrets(value, fieldsToMask)
      ])
    );
  }
  
  return data;
}
