import { useQuery } from '@tanstack/react-query';
import { useApi } from '@api/index';
import { queryKeys } from '@queries/queryKeys';

interface UseSearchCustomersParams {
  query?: string;
  page?: number;
  perPage?: number;
}

export const useSearchCustomers = (params: UseSearchCustomersParams = {}) => {
  const api = useApi();
  const { query, page, perPage } = params;

  return useQuery({
    queryKey: queryKeys.customers.search(query, page, perPage),
    queryFn: async () => {
      const response = await api.getSearchCustomers({
        query,
        page,
        per_page: perPage,
      });
      return response.data;
    },
    enabled: !!query,
  });
};
