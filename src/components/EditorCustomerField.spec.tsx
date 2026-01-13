import { render, screen } from '@testing-library/react-native';
import { EditorCustomerField } from '@components/EditorCustomerField';
import { withSpecWrapper } from '../specs/wrapper';
import { useForm } from 'react-hook-form';
import type { Components } from '@api/generated/client';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

type InvoiceFormData = {
  customer_id: string;
  finalized: boolean;
  paid: boolean;
  date: string;
  deadline: string;
  invoice_lines_attributes: {
    product_id: string;
    quantity: string;
  }[];
};

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

const TestComponent = ({
  selectedCustomer,
  errors,
}: {
  selectedCustomer?: Components.Schemas.Customer | null;
  errors?: any;
}) => {
  const { control } = useForm<InvoiceFormData>({
    defaultValues: {
      customer_id: '',
    },
  });
  const mockOnCustomerSelect = jest.fn();

  return (
    <EditorCustomerField
      control={control}
      selectedCustomer={selectedCustomer || null}
      onCustomerSelect={mockOnCustomerSelect}
      errors={errors || {}}
    />
  );
};

describe('EditorCustomerField', () => {
  it('renders editor customer field with all required fields', () => {
    render(withSpecWrapper(<TestComponent />));

    expect(screen.getByTestId('editor-customer-field')).toBeTruthy();
    expect(screen.getByTestId('editor-customer-field-label')).toBeTruthy();
    expect(screen.getByTestId('editor-customer-field-button')).toBeTruthy();
  });

  it('displays the correct label', () => {
    render(withSpecWrapper(<TestComponent />));

    const label = screen.getByTestId('editor-customer-field-label');
    expect(label).toBeTruthy();
    expect(label).toHaveTextContent('Customer');
  });

  it('displays placeholder text when no customer is selected', () => {
    render(withSpecWrapper(<TestComponent />));

    const text = screen.getByTestId('editor-customer-field-text');
    expect(text).toBeTruthy();
    expect(text).toHaveTextContent('Select a customer');
  });

  it('displays customer name when customer is selected', () => {
    render(withSpecWrapper(<TestComponent selectedCustomer={mockCustomer} />));

    const text = screen.getByTestId('editor-customer-field-text');
    expect(text).toBeTruthy();
    expect(text).toHaveTextContent('John Doe');
  });

  it('displays error message when customer error is present', () => {
    render(
      withSpecWrapper(
        <TestComponent
          errors={{ customer_id: { type: 'required', message: 'Customer is required' } }}
        />,
      ),
    );

    const error = screen.getByTestId('editor-customer-field-error');
    expect(error).toBeTruthy();
    expect(error).toHaveTextContent('Customer is required');
  });

  it('does not display error when no error is present', () => {
    render(withSpecWrapper(<TestComponent />));

    expect(screen.queryByTestId('editor-customer-field-error')).toBeNull();
  });
});
