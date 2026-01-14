import { useEffect } from 'react';
import { UseFormReset } from 'react-hook-form';
import { useInvoiceOptional } from '@queries/useInvoice';
import type { Components } from '@api/generated/client';
import type { InvoiceFormDataWithIds } from '@components/EditorInvoiceLines';

const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

type UseInvoiceFormInitializationParams = {
  isEditMode: boolean;
  invoiceId?: number;
  reset: UseFormReset<InvoiceFormDataWithIds>;
  setSelectedCustomer: (customer: Components.Schemas.Customer | null) => void;
  setSelectedProducts: (products: Map<number, Components.Schemas.Product>) => void;
  setOriginalLineIds: React.Dispatch<React.SetStateAction<Set<number>>>;
};

export const useInvoiceFormInitialization = ({
  isEditMode,
  invoiceId,
  reset,
  setSelectedCustomer,
  setSelectedProducts,
  setOriginalLineIds,
}: UseInvoiceFormInitializationParams) => {
  const invoiceQuery = useInvoiceOptional(invoiceId, isEditMode);
  const invoiceData = invoiceQuery.data || null;

  useEffect(() => {
    if (isEditMode && invoiceData) {
      const invoice = invoiceData as Components.Schemas.Invoice & {
        customer?: Components.Schemas.Customer;
      };

      if (invoice.customer) {
        setSelectedCustomer(invoice.customer);
      }

      const lines = invoice.invoice_lines || [];
      const productsMap = new Map<number, Components.Schemas.Product>();
      const lineIds = new Set<number>();

      lines.forEach((line, index) => {
        if (line.product) {
          productsMap.set(index, line.product);
        }
        if (line.id) {
          lineIds.add(line.id);
        }
      });

      setSelectedProducts(productsMap);
      setOriginalLineIds(lineIds);

      reset({
        customer_id: invoice.customer_id ? String(invoice.customer_id) : '',
        finalized: invoice.finalized || false,
        paid: invoice.paid || false,
        date: invoice.date || formatDateForInput(new Date()),
        deadline:
          invoice.deadline || formatDateForInput(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
        invoice_lines_attributes:
          lines.length > 0
            ? lines.map((line) => ({
                id: line.id ? String(line.id) : undefined,
                product_id: line.product_id ? String(line.product_id) : '',
                quantity: line.quantity ? String(line.quantity) : '1',
              }))
            : [{ product_id: '', quantity: '1' }],
      });
    } else {
      setOriginalLineIds(new Set());
    }
  }, [
    isEditMode,
    invoiceData,
    reset,
    setSelectedCustomer,
    setSelectedProducts,
    setOriginalLineIds,
  ]);

  return { invoiceData };
};
