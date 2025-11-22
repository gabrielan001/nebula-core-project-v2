# Security Implementation

This document outlines the security measures implemented in the application.

## Authentication & API Keys

- All API endpoints (except public routes) require a valid `x-api-key` header
- API keys are validated against the database on each request
- Rate limiting is applied per API key
- Sensitive information is never logged or exposed in responses

## Rate Limiting

- Uses Redis with a fixed-window algorithm
- Default limit: 60 requests per minute per API key
- Rate limit headers are included in responses:
  - `X-RateLimit-Limit`: Maximum number of requests allowed in the window
  - `X-RateLimit-Remaining`: Remaining requests in the current window
  - `X-RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)

## Audit Logging

All API requests are logged to the `audit_logs` table with the following information:
- Team ID
- Request path
- HTTP method
- Payload hash (SHA-256)
- Status code
- Timestamp

## Input Sanitization

All user inputs are sanitized to prevent XSS and injection attacks:
- HTML/JavaScript is automatically escaped
- Special characters are converted to HTML entities
- Nested objects and arrays are recursively sanitized

## Secret Management

- Sensitive fields (passwords, API keys, tokens) are automatically masked in logs
- Environment variables are used for all configuration
- Required environment variables are validated at startup

## Environment Variables

The following environment variables are required:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```

Optional variables with defaults:
```
RATE_LIMIT_WINDOW_MS=60000  # 1 minute
RATE_LIMIT_MAX_REQUESTS=60   # 60 requests per window
```
