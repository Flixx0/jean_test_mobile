import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@api/index';
import { queryKeys } from '@queries/queryKeys';

export const useDeleteInvoice = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.deleteInvoice({ id });
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.lists() });
    },
  });
};
