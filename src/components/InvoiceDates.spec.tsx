import { render, screen } from '@testing-library/react-native';
import { InvoiceDates } from '@components/InvoiceDates';
import { withSpecWrapper } from '../specs/wrapper';

describe('InvoiceDates', () => {
  it('renders invoice dates with all required fields', () => {
    render(
      withSpecWrapper(<InvoiceDates date="2024-01-15" deadline="2024-02-15" isOverdue={false} />),
    );

    expect(screen.getByTestId('invoice-dates')).toBeTruthy();
    expect(screen.getByTestId('invoice-dates-issued-row')).toBeTruthy();
    expect(screen.getByTestId('invoice-dates-deadline-row')).toBeTruthy();
  });

  it('displays the correct issued date label', () => {
    render(
      withSpecWrapper(<InvoiceDates date="2024-01-15" deadline="2024-02-15" isOverdue={false} />),
    );

    const label = screen.getByTestId('invoice-dates-issued-label');
    expect(label).toBeTruthy();
    expect(label).toHaveTextContent('Issued on');
  });

  it('displays the correct issued date value', () => {
    render(
      withSpecWrapper(<InvoiceDates date="2024-01-15" deadline="2024-02-15" isOverdue={false} />),
    );

    const value = screen.getByTestId('invoice-dates-issued-value');
    expect(value).toBeTruthy();
    expect(value).toHaveTextContent('2024-01-15');
  });

  it('displays the correct deadline label', () => {
    render(
      withSpecWrapper(<InvoiceDates date="2024-01-15" deadline="2024-02-15" isOverdue={false} />),
    );

    const label = screen.getByTestId('invoice-dates-deadline-label');
    expect(label).toBeTruthy();
    expect(label).toHaveTextContent('Deadline');
  });

  it('displays the correct deadline value', () => {
    render(
      withSpecWrapper(<InvoiceDates date="2024-01-15" deadline="2024-02-15" isOverdue={false} />),
    );

    const value = screen.getByTestId('invoice-dates-deadline-value');
    expect(value).toBeTruthy();
    expect(value).toHaveTextContent('2024-02-15');
  });

  it('does not display deadline when deadline is null', () => {
    render(withSpecWrapper(<InvoiceDates date="2024-01-15" deadline={null} isOverdue={false} />));

    expect(screen.getByTestId('invoice-dates-issued-row')).toBeTruthy();
    expect(screen.queryByTestId('invoice-dates-deadline-row')).toBeNull();
  });
});
