import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { UseFormReset } from 'react-hook-form';
import { useCreateInvoice } from '@queries/useCreateInvoice';
import { useUpdateInvoice } from '@queries/useUpdateInvoice';
import { useSelection } from '@contexts/SelectionContext';
import type { Paths } from '@api/generated/client';
import type { InvoiceFormData, InvoiceFormDataWithIds } from '@components/EditorInvoiceLines';

type UseSubmitInvoiceParams = {
  isEditMode: boolean;
  invoiceId?: number;
  originalLineIds: Set<number>;
  navigation: NavigationProp<any>;
  reset: UseFormReset<InvoiceFormData>;
};

export const useSubmitInvoice = ({
  isEditMode,
  invoiceId,
  originalLineIds,
  navigation,
  reset,
}: UseSubmitInvoiceParams) => {
  const createInvoiceMutation = useCreateInvoice();
  const updateInvoiceMutation = useUpdateInvoice();
  const { clearSelection } = useSelection();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (data: InvoiceFormDataWithIds) => {
      setIsSubmitting(true);
      try {
        if (isEditMode && invoiceId) {
          const currentLineIds = new Set(
            data.invoice_lines_attributes
              .map((line) => (line.id ? Number.parseInt(line.id, 10) : null))
              .filter((id): id is number => id !== null),
          );

          const deletedLines = Array.from(originalLineIds)
            .filter((id) => !currentLineIds.has(id))
            .map((id) => ({ id, _destroy: true as const }));

          const updatedLines = data.invoice_lines_attributes.map((line) => {
            const linePayload: {
              id?: number;
              product_id: number;
              quantity: number;
            } = {
              product_id: Number.parseInt(line.product_id, 10),
              quantity: line.quantity ? Number.parseInt(line.quantity, 10) : 1,
            };

            if (line.id) {
              linePayload.id = Number.parseInt(line.id, 10);
            }

            return linePayload;
          });

          const payload: Paths.PutInvoice.RequestBody = {
            invoice: {
              id: invoiceId,
              customer_id: data.customer_id ? Number.parseInt(data.customer_id, 10) : undefined,
              finalized: data.finalized,
              paid: data.paid,
              date: data.date,
              deadline: data.deadline,
              invoice_lines_attributes: [...updatedLines, ...deletedLines],
            },
          };

          await updateInvoiceMutation.mutateAsync({ id: invoiceId, data: payload });
          navigation.goBack();
        } else {
          const payload: Paths.PostInvoices.RequestBody = {
            invoice: {
              customer_id: Number.parseInt(data.customer_id, 10),
              finalized: data.finalized,
              paid: data.paid,
              date: data.date,
              deadline: data.deadline,
              invoice_lines_attributes: data.invoice_lines_attributes.map((line) => ({
                product_id: Number.parseInt(line.product_id, 10),
                quantity: line.quantity ? Number.parseInt(line.quantity, 10) : 1,
              })),
            },
          };

          const response = await createInvoiceMutation.mutateAsync(payload);
          if (response?.id) {
            Alert.alert('Invoice created successfully', `Invoice ID: ${response.id}`);
            clearSelection();
            reset();
          } else {
            navigation.goBack();
          }
        }
      } catch (error) {
        console.error(`Error ${isEditMode ? 'updating' : 'creating'} invoice:`, error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isEditMode,
      invoiceId,
      createInvoiceMutation,
      updateInvoiceMutation,
      navigation,
      originalLineIds,
      clearSelection,
      reset,
    ],
  );

  return { onSubmit, isSubmitting };
};
