import { render, screen } from '@testing-library/react-native';
import { InvoiceItemsList } from '@components/InvoiceItemsList';
import { withSpecWrapper } from '../specs/wrapper';
import type { Components } from '@api/generated/client';

const mockInvoiceLine: Components.Schemas.InvoiceLine = {
  id: 1,
  invoice_id: 100,
  product_id: 5,
  quantity: 2,
  label: 'Test Product',
  unit: 'piece',
  vat_rate: '20',
  price: '120.00',
  tax: '20.00',
  product: {
    id: 5,
    label: 'Test Product',
    unit: 'piece',
    vat_rate: '20',
    unit_price: '60.00',
    unit_price_without_tax: '50.00',
    unit_tax: '10.00',
  },
};

describe('InvoiceItemsList', () => {
  it('renders invoice items list with all required fields', () => {
    render(withSpecWrapper(<InvoiceItemsList invoiceLines={[mockInvoiceLine]} />));

    expect(screen.getByTestId('invoice-items-list')).toBeTruthy();
    expect(screen.getByTestId('invoice-items-list-header')).toBeTruthy();
    expect(screen.getByTestId('invoice-items-list-flatlist')).toBeTruthy();
  });

  it('displays the correct title', () => {
    render(withSpecWrapper(<InvoiceItemsList invoiceLines={[mockInvoiceLine]} />));

    const title = screen.getByTestId('invoice-items-list-title');
    expect(title).toBeTruthy();
    expect(title).toHaveTextContent('Invoice items');
  });

  it('displays the correct count for single item', () => {
    render(withSpecWrapper(<InvoiceItemsList invoiceLines={[mockInvoiceLine]} />));

    const count = screen.getByTestId('invoice-items-list-count');
    expect(count).toBeTruthy();
    expect(count).toHaveTextContent('1 item');
  });

  it('displays the correct count for multiple items', () => {
    const multipleLines = [mockInvoiceLine, { ...mockInvoiceLine, id: 2 }];
    render(withSpecWrapper(<InvoiceItemsList invoiceLines={multipleLines} />));

    const count = screen.getByTestId('invoice-items-list-count');
    expect(count).toBeTruthy();
    expect(count).toHaveTextContent('2 items');
  });

  it('displays empty state when invoiceLines is empty', () => {
    render(withSpecWrapper(<InvoiceItemsList invoiceLines={[]} />));

    expect(screen.getByTestId('invoice-items-list-empty')).toBeTruthy();
    const emptyText = screen.getByTestId('invoice-items-list-empty-text');
    expect(emptyText).toBeTruthy();
    expect(emptyText).toHaveTextContent('No items in this invoice');
  });

  it('does not display flatlist when invoiceLines is empty', () => {
    render(withSpecWrapper(<InvoiceItemsList invoiceLines={[]} />));

    expect(screen.queryByTestId('invoice-items-list-flatlist')).toBeNull();
  });
});
