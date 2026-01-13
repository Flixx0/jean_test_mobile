import { render, screen, fireEvent } from '@testing-library/react-native';
import { InvoiceHeader } from '@components/InvoiceHeader';
import { withSpecWrapper } from '../specs/wrapper';

describe('InvoiceHeader', () => {
  it('renders invoice header with all required fields', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    render(
      withSpecWrapper(
        <InvoiceHeader
          finalized={false}
          paid={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          canDelete={true}
        />,
      ),
    );

    expect(screen.getByTestId('invoice-header')).toBeTruthy();
  });

  it('displays edit button when invoice is not paid and not finalized', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    render(
      withSpecWrapper(
        <InvoiceHeader
          finalized={false}
          paid={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          canDelete={true}
        />,
      ),
    );

    expect(screen.getByTestId('invoice-header-edit-button')).toBeTruthy();
  });

  it('does not display edit button when invoice is paid', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    render(
      withSpecWrapper(
        <InvoiceHeader
          finalized={true}
          paid={true}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          canDelete={false}
        />,
      ),
    );

    expect(screen.queryByTestId('invoice-header-edit-button')).toBeNull();
  });

  it('does not display edit button when invoice is finalized', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    render(
      withSpecWrapper(
        <InvoiceHeader
          finalized={true}
          paid={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          canDelete={false}
        />,
      ),
    );

    expect(screen.queryByTestId('invoice-header-edit-button')).toBeNull();
  });

  it('displays delete button when canDelete is true', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    render(
      withSpecWrapper(
        <InvoiceHeader
          finalized={false}
          paid={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          canDelete={true}
        />,
      ),
    );

    expect(screen.getByTestId('invoice-header-delete-button')).toBeTruthy();
  });

  it('does not display delete button when canDelete is false', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    render(
      withSpecWrapper(
        <InvoiceHeader
          finalized={true}
          paid={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          canDelete={false}
        />,
      ),
    );

    expect(screen.queryByTestId('invoice-header-delete-button')).toBeNull();
  });

  it('calls onEdit when edit button is pressed', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    render(
      withSpecWrapper(
        <InvoiceHeader
          finalized={false}
          paid={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          canDelete={true}
        />,
      ),
    );

    const editButton = screen.getByTestId('invoice-header-edit-button');
    fireEvent.press(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is pressed', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    render(
      withSpecWrapper(
        <InvoiceHeader
          finalized={false}
          paid={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          canDelete={true}
        />,
      ),
    );

    const deleteButton = screen.getByTestId('invoice-header-delete-button');
    fireEvent.press(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});
