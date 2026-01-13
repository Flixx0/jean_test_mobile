import { render, screen } from '@testing-library/react-native';
import { EditorTotal } from '@components/EditorTotal';
import { withSpecWrapper } from '../specs/wrapper';
import { formatPriceWithCurrency } from '@utils/formatPrice';

describe('EditorTotal', () => {
  it('renders editor total with all required fields when totalPrice is greater than 0', () => {
    render(withSpecWrapper(<EditorTotal totalPrice={120.5} />));

    expect(screen.getByTestId('editor-total')).toBeTruthy();
    expect(screen.getByTestId('editor-total-label')).toBeTruthy();
    expect(screen.getByTestId('editor-total-value')).toBeTruthy();
  });

  it('displays the correct total label', () => {
    render(withSpecWrapper(<EditorTotal totalPrice={120.5} />));

    const label = screen.getByTestId('editor-total-label');
    expect(label).toBeTruthy();
    expect(label).toHaveTextContent('Total');
  });

  it('displays the correct total value', () => {
    render(withSpecWrapper(<EditorTotal totalPrice={120.5} />));

    const value = screen.getByTestId('editor-total-value');
    expect(value).toBeTruthy();
    expect(value).toHaveTextContent(formatPriceWithCurrency('120.5'));
  });

  it('does not render when totalPrice is 0', () => {
    render(withSpecWrapper(<EditorTotal totalPrice={0} />));

    expect(screen.queryByTestId('editor-total')).toBeNull();
  });

  it('does not render when totalPrice is negative', () => {
    render(withSpecWrapper(<EditorTotal totalPrice={-10} />));

    expect(screen.queryByTestId('editor-total')).toBeNull();
  });
});
