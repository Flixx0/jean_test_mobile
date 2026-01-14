import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UIProvider } from '@ui/config';
import { SelectionProvider } from '@contexts/SelectionContext';

const queryClient = new QueryClient();

export const withSpecWrapper = (component: ReactNode) => {
  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider>
        <SelectionProvider>{component}</SelectionProvider>
      </UIProvider>
    </QueryClientProvider>
  );
};
