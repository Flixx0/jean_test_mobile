import { useQuery } from '@tanstack/react-query';
import { useApi } from '@api/index';
import { queryKeys } from '@queries/queryKeys';

export const useInvoice = (id: number) => {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.invoices.detail(id),
    queryFn: async () => {
      const response = await api.getInvoice({ id });
      return response.data;
    },
    enabled: !!id,
  });
};
