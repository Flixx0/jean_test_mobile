import { render, screen } from '@testing-library/react-native';
import { EditorInvoiceLines, InvoiceFormData } from '@components/EditorInvoiceLines';
import { withSpecWrapper } from '../specs/wrapper';
import { useForm, useFieldArray } from 'react-hook-form';
import type { Components } from '@api/generated/client';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

const TestComponent = ({ errors }: { errors?: any }) => {
  const { control } = useForm<InvoiceFormData>({
    defaultValues: {
      invoice_lines_attributes: [{ product_id: '', quantity: '' }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'invoice_lines_attributes',
  });
  const selectedProducts = new Map<number, Components.Schemas.Product>();
  const mockOnAddLine = jest.fn(() => append({ product_id: '', quantity: '' }));
  const mockOnRemoveLine = jest.fn((index: number) => remove(index));
  const mockOnProductSelect = jest.fn();

  return (
    <EditorInvoiceLines
      control={control}
      fields={fields}
      selectedProducts={selectedProducts}
      onAddLine={mockOnAddLine}
      onRemoveLine={mockOnRemoveLine}
      onProductSelect={mockOnProductSelect}
      errors={errors || {}}
    />
  );
};

describe('EditorInvoiceLines', () => {
  it('renders editor invoice lines with all required fields', () => {
    render(withSpecWrapper(<TestComponent />));

    expect(screen.getByTestId('editor-invoice-lines')).toBeTruthy();
    expect(screen.getByTestId('editor-invoice-lines-header')).toBeTruthy();
    expect(screen.getByTestId('editor-invoice-lines-label')).toBeTruthy();
    expect(screen.getByTestId('editor-invoice-lines-add-button')).toBeTruthy();
  });

  it('displays the correct label', () => {
    render(withSpecWrapper(<TestComponent />));

    const label = screen.getByTestId('editor-invoice-lines-label');
    expect(label).toBeTruthy();
    expect(label).toHaveTextContent('Invoice Lines');
  });

  it('displays add line button', () => {
    render(withSpecWrapper(<TestComponent />));

    const button = screen.getByTestId('editor-invoice-lines-add-button');
    expect(button).toBeTruthy();
    const buttonText = screen.getByTestId('editor-invoice-lines-add-button-text');
    expect(buttonText).toBeTruthy();
    expect(buttonText).toHaveTextContent('Add Line');
  });

  it('renders invoice line items', () => {
    render(withSpecWrapper(<TestComponent />));

    expect(screen.getByTestId('editor-invoice-line-item-0')).toBeTruthy();
  });
});
