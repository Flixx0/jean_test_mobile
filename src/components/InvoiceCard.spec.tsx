import { render, screen } from '@testing-library/react-native';
import { InvoiceCard } from '@components/InvoiceCard';
import { withSpecWrapper } from '../specs/wrapper';
import type { Paths } from '@api/generated/client';
import { formatPriceWithCurrency } from '@utils/formatPrice';
import { format } from 'date-fns';

type InvoiceItem = Paths.GetInvoices.Responses.$200['invoices'][number];

const mockInvoice: InvoiceItem = {
  id: 100,
  customer_id: 5,
  finalized: false,
  paid: false,
  date: '2024-01-15',
  deadline: '2024-02-15',
  total: '120.00',
  tax: '20.00',
  invoice_lines: [],
  customer: {
    id: 5,
    first_name: 'John',
    last_name: 'Doe',
    address: '123 Main St',
    zip_code: '12345',
    city: 'Paris',
    country: 'France',
    country_code: 'FR',
  },
};

describe('InvoiceCard', () => {
  it('renders invoice card with all required fields', () => {
    const mockOnPress = jest.fn();
    render(withSpecWrapper(<InvoiceCard invoice={mockInvoice} onPress={mockOnPress} />));

    expect(screen.getByTestId('invoice-card')).toBeTruthy();
    expect(screen.getByTestId('invoice-card-id')).toBeTruthy();
    expect(screen.getByTestId('invoice-card-customer')).toBeTruthy();
    expect(screen.getByTestId('invoice-card-date')).toBeTruthy();
    expect(screen.getByTestId('invoice-card-deadline')).toBeTruthy();
    expect(screen.getByTestId('invoice-card-total')).toBeTruthy();
  });

  it('displays the correct invoice ID', () => {
    const mockOnPress = jest.fn();
    render(withSpecWrapper(<InvoiceCard invoice={mockInvoice} onPress={mockOnPress} />));

    const invoiceId = screen.getByTestId('invoice-card-id');
    expect(invoiceId).toBeTruthy();
    expect(invoiceId).toHaveTextContent('Invoice #100');
  });

  it('displays the correct customer name', () => {
    const mockOnPress = jest.fn();
    render(withSpecWrapper(<InvoiceCard invoice={mockInvoice} onPress={mockOnPress} />));

    const customer = screen.getByTestId('invoice-card-customer');
    expect(customer).toBeTruthy();
    expect(customer).toHaveTextContent('John Doe');
  });

  it('displays the correct date', () => {
    const mockOnPress = jest.fn();
    render(withSpecWrapper(<InvoiceCard invoice={mockInvoice} onPress={mockOnPress} />));

    const date = screen.getByTestId('invoice-card-date');
    expect(date).toBeTruthy();
    expect(date).toHaveTextContent(format(new Date(mockInvoice.date!), 'dd/MM/yyyy'));
  });

  it('displays the correct deadline', () => {
    const mockOnPress = jest.fn();
    render(withSpecWrapper(<InvoiceCard invoice={mockInvoice} onPress={mockOnPress} />));

    const deadline = screen.getByTestId('invoice-card-deadline');
    expect(deadline).toBeTruthy();
    expect(deadline).toHaveTextContent(
      `Due: ${format(new Date(mockInvoice.deadline!), 'dd/MM/yyyy')}`,
    );
  });

  it('displays the correct total', () => {
    const mockOnPress = jest.fn();
    render(withSpecWrapper(<InvoiceCard invoice={mockInvoice} onPress={mockOnPress} />));

    const total = screen.getByTestId('invoice-card-total');
    expect(total).toBeTruthy();
    expect(total).toHaveTextContent(formatPriceWithCurrency(mockInvoice.total!));
  });

  it('does not display customer when customer is not present', () => {
    const invoiceWithoutCustomer: InvoiceItem = {
      ...mockInvoice,
      customer: undefined,
    };
    const mockOnPress = jest.fn();
    render(withSpecWrapper(<InvoiceCard invoice={invoiceWithoutCustomer} onPress={mockOnPress} />));

    expect(screen.queryByTestId('invoice-card-customer')).toBeNull();
  });

  it('does not display date when date is null', () => {
    const invoiceWithoutDate: InvoiceItem = {
      ...mockInvoice,
      date: null,
    };
    const mockOnPress = jest.fn();
    render(withSpecWrapper(<InvoiceCard invoice={invoiceWithoutDate} onPress={mockOnPress} />));

    expect(screen.queryByTestId('invoice-card-date')).toBeNull();
  });

  it('does not display deadline when deadline is null', () => {
    const invoiceWithoutDeadline: InvoiceItem = {
      ...mockInvoice,
      deadline: null,
    };
    const mockOnPress = jest.fn();
    render(withSpecWrapper(<InvoiceCard invoice={invoiceWithoutDeadline} onPress={mockOnPress} />));

    expect(screen.queryByTestId('invoice-card-deadline')).toBeNull();
  });

  it('displays "-" when total is null', () => {
    const invoiceWithoutTotal: InvoiceItem = {
      ...mockInvoice,
      total: null,
    };
    const mockOnPress = jest.fn();
    render(withSpecWrapper(<InvoiceCard invoice={invoiceWithoutTotal} onPress={mockOnPress} />));

    const total = screen.getByTestId('invoice-card-total');
    expect(total).toBeTruthy();
    expect(total).toHaveTextContent('-');
  });
});
