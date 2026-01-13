import { render, screen } from '@testing-library/react-native';
import { InvoiceCustomerInfo } from '@components/InvoiceCustomerInfo';
import { withSpecWrapper } from '../specs/wrapper';
import type { Components } from '@api/generated/client';

const mockCustomer: Components.Schemas.Customer = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  address: '123 Main St',
  zip_code: '12345',
  city: 'Paris',
  country: 'France',
  country_code: 'FR',
};

describe('InvoiceCustomerInfo', () => {
  it('renders invoice customer info with customer', () => {
    render(withSpecWrapper(<InvoiceCustomerInfo customer={mockCustomer} />));

    expect(screen.getByTestId('invoice-customer-info')).toBeTruthy();
    expect(screen.getByTestId('invoice-customer-info-title')).toBeTruthy();
    expect(screen.getByTestId('invoice-customer-info-name')).toBeTruthy();
  });

  it('displays the correct title', () => {
    render(withSpecWrapper(<InvoiceCustomerInfo customer={mockCustomer} />));

    const title = screen.getByTestId('invoice-customer-info-title');
    expect(title).toBeTruthy();
    expect(title).toHaveTextContent('Bill To');
  });

  it('displays the correct customer name', () => {
    render(withSpecWrapper(<InvoiceCustomerInfo customer={mockCustomer} />));

    const name = screen.getByTestId('invoice-customer-info-name');
    expect(name).toBeTruthy();
    expect(name).toHaveTextContent('John Doe');
  });

  it('displays the correct address when present', () => {
    render(withSpecWrapper(<InvoiceCustomerInfo customer={mockCustomer} />));

    const address = screen.getByTestId('invoice-customer-info-address');
    expect(address).toBeTruthy();
    expect(address).toHaveTextContent('123 Main St');
  });

  it('displays the correct zip code when present', () => {
    render(withSpecWrapper(<InvoiceCustomerInfo customer={mockCustomer} />));

    const zipCode = screen.getByTestId('invoice-customer-info-zip-code');
    expect(zipCode).toBeTruthy();
    expect(zipCode).toHaveTextContent('12345');
  });

  it('displays the correct city when present', () => {
    render(withSpecWrapper(<InvoiceCustomerInfo customer={mockCustomer} />));

    const city = screen.getByTestId('invoice-customer-info-city');
    expect(city).toBeTruthy();
    expect(city).toHaveTextContent('Paris');
  });

  it('displays the correct country when present', () => {
    render(withSpecWrapper(<InvoiceCustomerInfo customer={mockCustomer} />));

    const country = screen.getByTestId('invoice-customer-info-country');
    expect(country).toBeTruthy();
    expect(country).toHaveTextContent('France (FR)');
  });

  it('displays customer ID when customer is not provided but customerId is', () => {
    render(withSpecWrapper(<InvoiceCustomerInfo customer={undefined} customerId={5} />));

    expect(screen.getByTestId('invoice-customer-info-id-only')).toBeTruthy();
    const customerId = screen.getByTestId('invoice-customer-info-id');
    expect(customerId).toBeTruthy();
    expect(customerId).toHaveTextContent('Customer ID: 5');
  });

  it('does not render when both customer and customerId are not provided', () => {
    render(withSpecWrapper(<InvoiceCustomerInfo customer={undefined} customerId={null} />));

    expect(screen.queryByTestId('invoice-customer-info')).toBeNull();
    expect(screen.queryByTestId('invoice-customer-info-id-only')).toBeNull();
  });

  it('does not display address when address is not present', () => {
    const customerWithoutAddress: Components.Schemas.Customer = {
      ...mockCustomer,
      address: '',
    };
    render(withSpecWrapper(<InvoiceCustomerInfo customer={customerWithoutAddress} />));

    expect(screen.queryByTestId('invoice-customer-info-address')).toBeNull();
  });
});
