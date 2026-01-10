import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UIProvider } from '@ui/config';

const queryClient = new QueryClient();

export const withSpecWrapper = (component: ReactNode) => {
  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider>{component}</UIProvider>
    </QueryClientProvider>
  );
};
