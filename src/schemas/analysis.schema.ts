import { z } from 'zod';

export const AnalysisInput = z.object({
  targetPath: z.string().optional(),
  scope: z.enum(['full', 'ui', 'perf']).default('full'),
});

export type AnalysisInput = z.infer<typeof AnalysisInput>;
