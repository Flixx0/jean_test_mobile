import { useSuspenseQuery, useQuery } from '@tanstack/react-query';
import { useApi } from '@api/index';
import { queryKeys } from '@queries/queryKeys';

// Use suspense query when id is guaranteed to be defined (for Invoice screen)
export const useInvoice = (id: number) => {
  const api = useApi();

  return useSuspenseQuery({
    queryKey: queryKeys.invoices.detail(id),
    queryFn: async () => {
      const response = await api.getInvoice({ id });
      return response.data;
    },
  });
};

// Use regular query for optional/conditional cases (for Editor screen)
export const useInvoiceOptional = (id: number | undefined, enabled: boolean = true) => {
  const api = useApi();

  return useQuery({
    queryKey: id ? queryKeys.invoices.detail(id) : ['invoice', 'skip'],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.getInvoice({ id });
      return response.data;
    },
    enabled: enabled && Boolean(id),
  });
};
