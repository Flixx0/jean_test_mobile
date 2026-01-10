import { useQuery } from '@tanstack/react-query';
import { useApi } from '@api/index';
import { queryKeys } from '@queries/queryKeys';

interface UseInvoicesParams {
  page?: number;
  perPage?: number;
  filter?: string;
}

export const useInvoices = (params: UseInvoicesParams = {}) => {
  const api = useApi();
  const { page = 1, perPage = 50, filter = JSON.stringify([]) } = params;

  return useQuery({
    queryKey: queryKeys.invoices.list(page, perPage, filter),
    queryFn: async () => {
      const response = await api.getInvoices({
        page,
        per_page: perPage,
        filter,
      });
      return response.data;
    },
  });
};
