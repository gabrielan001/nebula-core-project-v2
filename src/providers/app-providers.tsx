'use client';

import { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { queryClient } from '@/lib/api/queryClient';

type AppProvidersProps = PropsWithChildren<{
  // Adicione props adicionais aqui, se necessário
}>;

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem 
        disableTransitionOnChange
      >
        {children}
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
