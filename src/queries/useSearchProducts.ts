import { useQuery } from '@tanstack/react-query';
import { useApi } from '@api/index';
import { queryKeys } from '@queries/queryKeys';

type UseSearchProductsParams = {
  query?: string;
  page?: number;
  perPage?: number;
};

export const useSearchProducts = (params: UseSearchProductsParams = {}) => {
  const api = useApi();
  const { query, page, perPage } = params;

  return useQuery({
    queryKey: queryKeys.products.search(query, page, perPage),
    queryFn: async () => {
      const response = await api.getSearchProducts({
        query,
        page,
        per_page: perPage,
      });
      return response.data;
    },
    enabled: !!query,
  });
};
