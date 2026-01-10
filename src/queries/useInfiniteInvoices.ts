import { useInfiniteQuery } from '@tanstack/react-query';
import { useApi } from '@api/index';
import { queryKeys } from '@queries/queryKeys';

type UseInfiniteInvoicesParams = {
  filter?: string;
  perPage?: number;
};

/**
 * Hook to fetch the list of invoices with infinite scroll
 */
export const useInfiniteInvoices = (params: UseInfiniteInvoicesParams = {}) => {
  const api = useApi();
  const { filter = JSON.stringify([]), perPage = 50 } = params;

  return useInfiniteQuery({
    queryKey: queryKeys.invoices.infinite(filter, perPage),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.getInvoices({
        page: pageParam,
        per_page: perPage,
        filter,
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
