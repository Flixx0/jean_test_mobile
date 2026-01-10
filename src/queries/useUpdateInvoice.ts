import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@api/index';
import { queryKeys } from '@queries/queryKeys';
import type { Paths } from '@api/generated/client';

type PutInvoiceRequestBody = Paths.PutInvoice.RequestBody;

type UseUpdateInvoiceParams = {
  id: number;
  data: PutInvoiceRequestBody;
};

export const useUpdateInvoice = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UseUpdateInvoiceParams) => {
      const response = await api.putInvoice({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.infinite(JSON.stringify([])) });
    },
  });
};
