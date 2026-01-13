import { useInfiniteQuery } from '@tanstack/react-query';
import { useApi } from '@api/index';
import { queryKeys } from '@queries/queryKeys';
import type { SortOption } from '@components/SortInvoicesBottomSheet';

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
    case 'paid':
      return '-paid, -finalized';
    case 'finalized':
      return '-finalized, +paid';
    case 'draft':
      return '+finalized, +paid';
    default:
      return undefined;
  }
};

const createQueryConfig = (api: ReturnType<typeof useApi>, params: UseInfiniteInvoicesParams) => {
  const { filter = JSON.stringify([]), perPage = 50, sortOption } = params;
  const sort = convertSortOptionToApiFormat(sortOption);

  return {
    queryKey: queryKeys.invoices.infinite(filter, perPage, sortOption),
    queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
      const queryParams: any = {
        page: pageParam,
        per_page: perPage,
        filter,
      };
      if (sort) {
        queryParams.sort = sort;
      }
      const response = await api.getInvoices(queryParams);
      return response.data;
    },
    getNextPageParam: (lastPage: any) => {
      const { pagination } = lastPage;
      const nextPage = pagination.page + 1;
      return nextPage <= pagination.total_pages ? nextPage : undefined;
    },
    initialPageParam: 1 as number,
  };
};

/**
 * Hook to fetch the list of invoices with infinite scroll
 */
export const useInfiniteInvoices = (params: UseInfiniteInvoicesParams = {}) => {
  const api = useApi();
  const queryConfig = createQueryConfig(api, params);
  return useInfiniteQuery(queryConfig);
};
