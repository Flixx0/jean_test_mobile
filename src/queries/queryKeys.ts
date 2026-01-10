export const queryKeys = {
  invoices: {
    all: ['invoices'] as const,
    infinite: (filter?: string, perPage?: number, sortOption?: string) =>
      [
        ...queryKeys.invoices.all,
        'infinite',
        { filter, per_page: perPage, sort: sortOption },
      ] as const,
    details: () => [...queryKeys.invoices.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.invoices.details(), id] as const,
  },
  customers: {
    all: ['customers'] as const,
    searches: () => [...queryKeys.customers.all, 'search'] as const,
    search: (query?: string, page?: number, perPage?: number) =>
      [...queryKeys.customers.searches(), { query, page, per_page: perPage }] as const,
  },
  products: {
    all: ['products'] as const,
    searches: () => [...queryKeys.products.all, 'search'] as const,
    search: (query?: string, page?: number, perPage?: number) =>
      [...queryKeys.products.searches(), { query, page, per_page: perPage }] as const,
  },
} as const;
