import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@api/index';
import { queryKeys } from '@queries/queryKeys';
import type { Paths } from '@api/generated/client';

type PostInvoicesRequestBody = Paths.PostInvoices.RequestBody;

export const useCreateInvoice = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PostInvoicesRequestBody) => {
      const response = await api.postInvoices(null, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.lists() });
    },
  });
};
