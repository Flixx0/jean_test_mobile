import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useApi } from '@api/index';
import { queryKeys } from '@queries/queryKeys';

type UseInfiniteProductsParams = {
  query?: string;
  perPage?: number;
};

/**
 * Hook to fetch the list of products with infinite scroll
 */
export const useInfiniteProducts = (params: UseInfiniteProductsParams = {}) => {
  const api = useApi();
  const { query, perPage = 30 } = params;

  return useSuspenseInfiniteQuery({
    queryKey: queryKeys.products.search(query, undefined, perPage),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.getSearchProducts({
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
