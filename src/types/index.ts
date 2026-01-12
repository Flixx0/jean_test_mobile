import type { Components } from '@api/generated/client';

export type NavigationParams = {
  Home: undefined;
  Editor: undefined;
  Invoice: { id: number };
  EditInvoice: { id: number };
  CustomerSelect: { onSelectCustomer: (customer: Components.Schemas.Customer) => void };
  ProductSelect: { onSelectProduct: (product: Components.Schemas.Product) => void };
};
