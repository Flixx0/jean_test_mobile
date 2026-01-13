import { render, screen } from '@testing-library/react-native';
import { InvoiceScreen } from '@screens/Invoice';
import { withSpecWrapper } from '../specs/wrapper';
import type { Components } from '@api/generated/client';
import { Alert } from 'react-native';
import { useInvoice } from '@queries/useInvoice';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: jest.fn(() => ({
    params: { id: 1 },
  })),
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  })),
}));

jest.mock('@queries/useInvoice', () => ({
  useInvoice: jest.fn(() => ({
    data: {
      id: 1,
      customer_id: 1,
      finalized: false,
      paid: false,
      date: '2024-01-01',
      deadline: '2024-01-31',
      total: 100,
      tax: 20,
      customer: {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        address: '123 Main St',
        zip_code: '12345',
        city: 'Paris',
        country: 'France',
        country_code: 'FR',
      } as Components.Schemas.Customer,
      invoice_lines: [
        {
          id: 1,
          product_id: 1,
          quantity: 2,
          product: {
            id: 1,
            label: 'Product 1',
            unit_price: '50.00',
          } as Components.Schemas.Product,
        },
      ],
    },
  })),
}));

jest.mock('@queries/useDeleteInvoice', () => ({
  useDeleteInvoice: jest.fn(() => ({
    mutate: jest.fn(),
  })),
}));

jest.mock('@queries/useUpdateInvoice', () => ({
  useUpdateInvoice: jest.fn(() => ({
    mutate: jest.fn(),
  })),
}));

jest.spyOn(Alert, 'alert');

describe('Invoice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders invoice screen', () => {
    render(withSpecWrapper(<InvoiceScreen />));

    expect(screen.getByTestId('invoice-header')).toBeTruthy();
  });

  it('displays invoice customer info', () => {
    render(withSpecWrapper(<InvoiceScreen />));

    expect(screen.getByTestId('invoice-customer-info')).toBeTruthy();
  });

  it('displays invoice dates', () => {
    render(withSpecWrapper(<InvoiceScreen />));

    expect(screen.getByTestId('invoice-dates')).toBeTruthy();
  });

  it('displays invoice items list', () => {
    render(withSpecWrapper(<InvoiceScreen />));

    expect(screen.getByTestId('invoice-items-list')).toBeTruthy();
  });

  it('displays invoice totals', () => {
    render(withSpecWrapper(<InvoiceScreen />));

    expect(screen.getByTestId('invoice-totals')).toBeTruthy();
  });

  it('displays finalize button when invoice is not finalized', () => {
    render(withSpecWrapper(<InvoiceScreen />));

    expect(screen.getByText('Finalize invoice')).toBeTruthy();
  });

  it('displays set as paid button when invoice is finalized but not paid', () => {
    (useInvoice as jest.Mock).mockReturnValueOnce({
      data: {
        id: 1,
        customer_id: 1,
        finalized: true,
        paid: false,
        date: '2024-01-01',
        deadline: '2024-01-31',
        total: 100,
        tax: 20,
        customer: {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
        } as Components.Schemas.Customer,
        invoice_lines: [],
      },
    });

    render(withSpecWrapper(<InvoiceScreen />));

    expect(screen.getByText('Set as paid')).toBeTruthy();
  });

  it('does not display status button when invoice is paid', () => {
    (useInvoice as jest.Mock).mockReturnValueOnce({
      data: {
        id: 1,
        customer_id: 1,
        finalized: true,
        paid: true,
        date: '2024-01-01',
        deadline: '2024-01-31',
        total: 100,
        tax: 20,
        customer: {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
        } as Components.Schemas.Customer,
        invoice_lines: [],
      },
    });

    render(withSpecWrapper(<InvoiceScreen />));

    expect(screen.queryByText('Finalize invoice')).toBeNull();
    expect(screen.queryByText('Set as paid')).toBeNull();
  });
});
