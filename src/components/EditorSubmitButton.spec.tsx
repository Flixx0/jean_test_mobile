import { render, screen, fireEvent } from '@testing-library/react-native';
import { EditorSubmitButton } from '@components/EditorSubmitButton';
import { withSpecWrapper } from '../specs/wrapper';

describe('EditorSubmitButton', () => {
  it('renders editor submit button with all required fields', () => {
    const mockOnSubmit = jest.fn();
    render(withSpecWrapper(<EditorSubmitButton onSubmit={mockOnSubmit} isSubmitting={false} />));

    expect(screen.getByTestId('editor-submit-button')).toBeTruthy();
    expect(screen.getByTestId('editor-submit-button-text')).toBeTruthy();
  });

  it('displays "Create Invoice" when not in edit mode and not submitting', () => {
    const mockOnSubmit = jest.fn();
    render(withSpecWrapper(<EditorSubmitButton onSubmit={mockOnSubmit} isSubmitting={false} />));

    const buttonText = screen.getByTestId('editor-submit-button-text');
    expect(buttonText).toBeTruthy();
    expect(buttonText).toHaveTextContent('Create Invoice');
  });

  it('displays "Update Invoice" when in edit mode and not submitting', () => {
    const mockOnSubmit = jest.fn();
    render(
      withSpecWrapper(
        <EditorSubmitButton onSubmit={mockOnSubmit} isSubmitting={false} isEditMode={true} />,
      ),
    );

    const buttonText = screen.getByTestId('editor-submit-button-text');
    expect(buttonText).toBeTruthy();
    expect(buttonText).toHaveTextContent('Update Invoice');
  });

  it('displays "Creating..." when submitting in create mode', () => {
    const mockOnSubmit = jest.fn();
    render(withSpecWrapper(<EditorSubmitButton onSubmit={mockOnSubmit} isSubmitting={true} />));

    const buttonText = screen.getByTestId('editor-submit-button-text');
    expect(buttonText).toBeTruthy();
    expect(buttonText).toHaveTextContent('Creating...');
  });

  it('displays "Updating..." when submitting in edit mode', () => {
    const mockOnSubmit = jest.fn();
    render(
      withSpecWrapper(
        <EditorSubmitButton onSubmit={mockOnSubmit} isSubmitting={true} isEditMode={true} />,
      ),
    );

    const buttonText = screen.getByTestId('editor-submit-button-text');
    expect(buttonText).toBeTruthy();
    expect(buttonText).toHaveTextContent('Updating...');
  });

  it('calls onSubmit when pressed', () => {
    const mockOnSubmit = jest.fn();
    render(withSpecWrapper(<EditorSubmitButton onSubmit={mockOnSubmit} isSubmitting={false} />));

    const button = screen.getByTestId('editor-submit-button');
    fireEvent.press(button);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});
