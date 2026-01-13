import { render, screen } from '@testing-library/react-native';
import { InvoiceTotals } from '@components/InvoiceTotals';
import { withSpecWrapper } from '../specs/wrapper';
import { formatPriceWithCurrency } from '@utils/formatPrice';

describe('InvoiceTotals', () => {
  it('renders invoice totals with all required fields', () => {
    render(withSpecWrapper(<InvoiceTotals tax="20.00" total="120.00" />));

    expect(screen.getByTestId('invoice-totals')).toBeTruthy();
    expect(screen.getByTestId('invoice-totals-tax-row')).toBeTruthy();
    expect(screen.getByTestId('invoice-totals-total-row')).toBeTruthy();
  });

  it('displays the correct tax label', () => {
    render(withSpecWrapper(<InvoiceTotals tax="20.00" total="120.00" />));

    const taxLabel = screen.getByTestId('invoice-totals-tax-label');
    expect(taxLabel).toBeTruthy();
    expect(taxLabel).toHaveTextContent('Tax');
  });

  it('displays the correct tax value', () => {
    render(withSpecWrapper(<InvoiceTotals tax="20.00" total="120.00" />));

    const taxValue = screen.getByTestId('invoice-totals-tax-value');
    expect(taxValue).toBeTruthy();
    expect(taxValue).toHaveTextContent(formatPriceWithCurrency('20.00'));
  });

  it('displays the correct total label', () => {
    render(withSpecWrapper(<InvoiceTotals tax="20.00" total="120.00" />));

    const totalLabel = screen.getByTestId('invoice-totals-total-label');
    expect(totalLabel).toBeTruthy();
    expect(totalLabel).toHaveTextContent('Total');
  });

  it('displays the correct total value', () => {
    render(withSpecWrapper(<InvoiceTotals tax="20.00" total="120.00" />));

    const totalValue = screen.getByTestId('invoice-totals-total-value');
    expect(totalValue).toBeTruthy();
    expect(totalValue).toHaveTextContent(formatPriceWithCurrency('120.00'));
  });

  it('displays separator between tax and total', () => {
    render(withSpecWrapper(<InvoiceTotals tax="20.00" total="120.00" />));

    const separator = screen.getByTestId('invoice-totals-separator');
    expect(separator).toBeTruthy();
  });

  it('does not display tax when tax is null', () => {
    render(withSpecWrapper(<InvoiceTotals tax={null} total="120.00" />));

    expect(screen.queryByTestId('invoice-totals-tax-row')).toBeNull();
    expect(screen.getByTestId('invoice-totals-total-row')).toBeTruthy();
  });

  it('does not display total when total is null', () => {
    render(withSpecWrapper(<InvoiceTotals tax="20.00" total={null} />));

    expect(screen.getByTestId('invoice-totals-tax-row')).toBeTruthy();
    expect(screen.queryByTestId('invoice-totals-total-row')).toBeNull();
    expect(screen.queryByTestId('invoice-totals-separator')).toBeNull();
  });

  it('does not display anything when both tax and total are null', () => {
    render(withSpecWrapper(<InvoiceTotals tax={null} total={null} />));

    expect(screen.queryByTestId('invoice-totals-tax-row')).toBeNull();
    expect(screen.queryByTestId('invoice-totals-total-row')).toBeNull();
    expect(screen.queryByTestId('invoice-totals-separator')).toBeNull();
  });
});
