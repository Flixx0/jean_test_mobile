import type { Components } from '@api/generated/client';

export type NavigationParams = {
  Home: undefined;
  Editor: undefined;
  Invoice: { id: number };
  EditInvoice: { id: number };
  //TODO: refactor to use contexts instead of functions in props
  CustomerSelect: { onSelectCustomer: (customer: Components.Schemas.Customer) => void };
  ProductSelect: { onSelectProduct: (product: Components.Schemas.Product) => void };
};
