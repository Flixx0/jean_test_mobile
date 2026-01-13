import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { useCreateInvoice } from '@queries/useCreateInvoice';
import { useUpdateInvoice } from '@queries/useUpdateInvoice';
import type { Paths } from '@api/generated/client';
import type { InvoiceFormDataWithIds } from '@components/EditorInvoiceLines';

type UseSubmitInvoiceParams = {
  isEditMode: boolean;
  invoiceId?: number;
  originalLineIds: Set<number>;
  navigation: NavigationProp<any>;
};

export const useSubmitInvoice = ({
  isEditMode,
  invoiceId,
  originalLineIds,
  navigation,
}: UseSubmitInvoiceParams) => {
  const createInvoiceMutation = useCreateInvoice();
  const updateInvoiceMutation = useUpdateInvoice();
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
    ],
  );

  return { onSubmit, isSubmitting };
};
