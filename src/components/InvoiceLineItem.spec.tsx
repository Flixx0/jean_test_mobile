import { render, screen } from '@testing-library/react-native';
import { InvoiceLineItem } from '@components/InvoiceLineItem';
import { withSpecWrapper } from '../specs/wrapper';
import type { Components } from '@api/generated/client';
import { formatPriceWithCurrency } from '@utils/formatPrice';

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

describe('InvoiceLineItem', () => {
  it('renders invoice line item with all required fields', () => {
    render(withSpecWrapper(<InvoiceLineItem item={mockInvoiceLine} />));

    expect(screen.getByTestId('invoice-line-item')).toBeTruthy();
    expect(screen.getByTestId('invoice-line-item-label')).toBeTruthy();
    expect(screen.getByTestId('invoice-line-item-quantity')).toBeTruthy();
    expect(screen.getByTestId('invoice-line-item-product-id')).toBeTruthy();
    expect(screen.getByTestId('invoice-line-item-price')).toBeTruthy();
  });

  it('displays the correct label', () => {
    render(withSpecWrapper(<InvoiceLineItem item={mockInvoiceLine} />));

    const label = screen.getByTestId('invoice-line-item-label');
    expect(label).toBeTruthy();
    expect(label.props.children).toBe('Test Product');
  });

  it('displays the correct quantity and unit', () => {
    render(withSpecWrapper(<InvoiceLineItem item={mockInvoiceLine} />));

    const quantity = screen.getByTestId('invoice-line-item-quantity');
    expect(quantity).toHaveTextContent('Quantity: 2 piece');
  });

  it('displays the correct product ID', () => {
    render(withSpecWrapper(<InvoiceLineItem item={mockInvoiceLine} />));

    const productId = screen.getByTestId('invoice-line-item-product-id');
    expect(productId).toBeTruthy();
    expect(productId).toHaveTextContent('Product ID: 5');
  });

  it('displays the correct price', () => {
    render(withSpecWrapper(<InvoiceLineItem item={mockInvoiceLine} />));

    const price = screen.getByTestId('invoice-line-item-price');
    expect(price).toBeTruthy();
    expect(price).toHaveTextContent(formatPriceWithCurrency(mockInvoiceLine.price));
  });

  it('displays tax when tax is present', () => {
    render(withSpecWrapper(<InvoiceLineItem item={mockInvoiceLine} />));

    const tax = screen.getByTestId('invoice-line-item-tax');
    expect(tax).toBeTruthy();
    expect(tax).toHaveTextContent(`Tax: ${formatPriceWithCurrency(mockInvoiceLine.tax)}`);
  });

  it('does not display tax when tax is empty string', () => {
    const invoiceLineWithoutTax: Components.Schemas.InvoiceLine = {
      ...mockInvoiceLine,
      tax: '',
    };

    render(withSpecWrapper(<InvoiceLineItem item={invoiceLineWithoutTax} />));

    expect(screen.queryByTestId('invoice-line-item-tax')).toBeNull();
  });
});
