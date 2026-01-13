import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { StatusSelect } from '@components/StatusSelect';
import { withSpecWrapper } from '../specs/wrapper';

describe('StatusSelect', () => {
  it('renders status select with all required fields', () => {
    const mockOnChange = jest.fn();
    render(withSpecWrapper(<StatusSelect value="draft" onChange={mockOnChange} />));

    expect(screen.getByTestId('status-select-pressable')).toBeTruthy();
    expect(screen.getByTestId('status-select-container')).toBeTruthy();
    expect(screen.getByTestId('status-select-input')).toBeTruthy();
  });

  it('displays the correct value for draft status', () => {
    const mockOnChange = jest.fn();
    render(withSpecWrapper(<StatusSelect value="draft" onChange={mockOnChange} />));

    const input = screen.getByTestId('status-select-input');
    expect(input).toBeTruthy();
    expect(input.props.value).toBe('Draft');
  });

  it('displays the correct value for finalized status', () => {
    const mockOnChange = jest.fn();
    render(withSpecWrapper(<StatusSelect value="finalized" onChange={mockOnChange} />));

    const input = screen.getByTestId('status-select-input');
    expect(input).toBeTruthy();
    expect(input.props.value).toBe('Finalized');
  });

  it('displays the correct value for paid status', () => {
    const mockOnChange = jest.fn();
    render(withSpecWrapper(<StatusSelect value="paid" onChange={mockOnChange} />));

    const input = screen.getByTestId('status-select-input');
    expect(input).toBeTruthy();
    expect(input.props.value).toBe('Paid');
  });

  it('displays placeholder when value is empty', () => {
    const mockOnChange = jest.fn();
    render(
      withSpecWrapper(
        <StatusSelect value="draft" onChange={mockOnChange} placeholder="Select status" />,
      ),
    );

    const input = screen.getByTestId('status-select-input');
    expect(input).toBeTruthy();
    expect(input.props.placeholder).toBe('Select status');
  });

  it('displays sheet title when sheet is open', () => {
    const mockOnChange = jest.fn();
    render(withSpecWrapper(<StatusSelect value="draft" onChange={mockOnChange} />));

    const pressable = screen.getByTestId('status-select-pressable');
    fireEvent.press(pressable);

    waitFor(() => {
      expect(screen.getByTestId('status-select-sheet-title')).toBeTruthy();
      expect(screen.getByTestId('status-select-sheet-title')).toHaveTextContent('Invoice Status');
    });
  });
});
