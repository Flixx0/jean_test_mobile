import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useApi } from '@api/index';
import { queryKeys } from '@queries/queryKeys';

type UseInfiniteCustomersParams = {
  query?: string;
  perPage?: number;
};

/**
 * Hook to fetch the list of customers with infinite scroll
 */
export const useInfiniteCustomers = (params: UseInfiniteCustomersParams = {}) => {
  const api = useApi();
  const { query, perPage = 30 } = params;

  return useSuspenseInfiniteQuery({
    queryKey: queryKeys.customers.search(query, undefined, perPage),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.getSearchCustomers({
        query,
        page: pageParam,
        per_page: perPage,
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      const nextPage = pagination.page + 1;
      return nextPage <= pagination.total_pages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
};
