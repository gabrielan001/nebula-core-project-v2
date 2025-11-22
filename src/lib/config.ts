// Environment variables type definition
type EnvVars = {
  // Required environment variables
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  
  // Optional environment variables with defaults
  NODE_ENV: 'development' | 'production' | 'test';
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
};

// Default values for optional environment variables
const defaults: Partial<EnvVars> = {
  NODE_ENV: 'development',
  RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 60, // 60 requests per minute
};

// Validate required environment variables
const requiredVars: (keyof EnvVars)[] = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
];

// Check for missing required environment variables
const missingVars = requiredVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// Export configuration with type safety
export const config: EnvVars = {
  ...defaults,
  ...process.env,
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || defaults.RATE_LIMIT_WINDOW_MS?.toString() || '60000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || defaults.RATE_LIMIT_MAX_REQUESTS?.toString() || '60', 10),
} as EnvVars;

// Export type for environment variables
export type { EnvVars };
