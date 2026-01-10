import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useApi } from '@api/index';
import { queryKeys } from '@queries/queryKeys';
import type { SortOption } from '@ui/index';

type UseInfiniteInvoicesParams = {
  filter?: string;
  perPage?: number;
  sortOption?: SortOption;
};

const convertSortOptionToApiFormat = (sortOption?: SortOption): string | undefined => {
  if (!sortOption) return undefined;

  switch (sortOption) {
    case 'date-desc':
      return '-date';
    case 'date-asc':
      return '+date';
    case 'total-desc':
      return '-total';
    case 'total-asc':
      return '+total';
    default:
      return undefined;
  }
};

/**
 * Hook to fetch the list of invoices with infinite scroll
 */
export const useInfiniteInvoices = (params: UseInfiniteInvoicesParams = {}) => {
  const api = useApi();
  const { filter = JSON.stringify([]), perPage = 50, sortOption } = params;
  const sort = convertSortOptionToApiFormat(sortOption);

  return useSuspenseInfiniteQuery({
    queryKey: queryKeys.invoices.infinite(filter, perPage, sortOption),
    queryFn: async ({ pageParam = 1 }) => {
      const params: any = {
        page: pageParam,
        per_page: perPage,
        filter,
      };
      if (sort) {
        params.sort = sort;
      }
      const response = await api.getInvoices(params);
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
