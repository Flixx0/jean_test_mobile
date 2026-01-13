import { render, screen } from '@testing-library/react-native';
import { EditorStatusField } from '@components/EditorStatusField';
import { withSpecWrapper } from '../specs/wrapper';

describe('EditorStatusField', () => {
  it('renders editor status field with all required fields', () => {
    const mockOnStatusChange = jest.fn();
    render(
      withSpecWrapper(
        <EditorStatusField status="draft" onStatusChange={mockOnStatusChange} errors={{}} />,
      ),
    );

    expect(screen.getByTestId('editor-status-field')).toBeTruthy();
    expect(screen.getByTestId('editor-status-field-label')).toBeTruthy();
  });

  it('displays the correct label', () => {
    const mockOnStatusChange = jest.fn();
    render(
      withSpecWrapper(
        <EditorStatusField status="draft" onStatusChange={mockOnStatusChange} errors={{}} />,
      ),
    );

    const label = screen.getByTestId('editor-status-field-label');
    expect(label).toBeTruthy();
    expect(label).toHaveTextContent('Status');
  });

  it('displays error message when finalized error is present', () => {
    const mockOnStatusChange = jest.fn();
    render(
      withSpecWrapper(
        <EditorStatusField
          status="draft"
          onStatusChange={mockOnStatusChange}
          errors={{ finalized: { type: 'required', message: 'Finalized error' } }}
        />,
      ),
    );

    const error = screen.getByTestId('editor-status-field-error');
    expect(error).toBeTruthy();
    expect(error).toHaveTextContent('Finalized error');
  });

  it('displays error message when paid error is present', () => {
    const mockOnStatusChange = jest.fn();
    render(
      withSpecWrapper(
        <EditorStatusField
          status="draft"
          onStatusChange={mockOnStatusChange}
          errors={{ paid: { type: 'required', message: 'Paid error' } }}
        />,
      ),
    );

    const error = screen.getByTestId('editor-status-field-error');
    expect(error).toBeTruthy();
    expect(error).toHaveTextContent('Paid error');
  });

  it('does not display error when no errors are present', () => {
    const mockOnStatusChange = jest.fn();
    render(
      withSpecWrapper(
        <EditorStatusField status="draft" onStatusChange={mockOnStatusChange} errors={{}} />,
      ),
    );

    expect(screen.queryByTestId('editor-status-field-error')).toBeNull();
  });
});
