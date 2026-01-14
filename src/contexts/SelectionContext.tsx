import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import type { Components } from '@api/generated/client';

type Customer = Components.Schemas.Customer;
type Product = Components.Schemas.Product;

type SelectionContextType = {
  selectedCustomer: Customer | null;
  selectedProducts: Map<number, Product>;
  setSelectedCustomer: (customer: Customer | null) => void;
  setSelectedProducts: (products: Map<number, Product>) => void;
  setProductAt: (index: number, product: Product | null) => void;
  clearSelection: () => void;
};

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

type SelectionProviderProps = {
  children: ReactNode;
};

export const SelectionProvider = ({ children }: SelectionProviderProps) => {
  const [selectedCustomer, setSelectedCustomerState] = useState<Customer | null>(null);
  const [selectedProducts, setSelectedProductsState] = useState<Map<number, Product>>(new Map());

  const setSelectedCustomer = useCallback((customer: Customer | null) => {
    setSelectedCustomerState(customer);
  }, []);

  const setSelectedProducts = useCallback((products: Map<number, Product>) => {
    setSelectedProductsState(products);
  }, []);

  const setProductAt = useCallback((index: number, product: Product | null) => {
    setSelectedProductsState((prev) => {
      const newMap = new Map(prev);
      if (product) {
        newMap.set(index, product);
      } else {
        newMap.delete(index);
      }
      return newMap;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCustomerState(null);
    setSelectedProductsState(new Map());
  }, []);

  const contextValue = useMemo(
    () => ({
      selectedCustomer,
      selectedProducts,
      setSelectedCustomer,
      setSelectedProducts,
      setProductAt,
      clearSelection,
    }),
    [
      selectedCustomer,
      selectedProducts,
      setSelectedCustomer,
      setSelectedProducts,
      setProductAt,
      clearSelection,
    ],
  );

  return <SelectionContext.Provider value={contextValue}>{children}</SelectionContext.Provider>;
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};
