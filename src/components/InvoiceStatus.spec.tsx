import { render, screen } from '@testing-library/react-native';
import { InvoiceStatus } from '@components/InvoiceStatus';
import { withSpecWrapper } from '../specs/wrapper';

describe('InvoiceStatus', () => {
  it('renders invoice status with all required fields', () => {
    render(withSpecWrapper(<InvoiceStatus finalized={false} paid={false} />));

    expect(screen.getByTestId('invoice-status')).toBeTruthy();
    expect(screen.getByTestId('invoice-status-label')).toBeTruthy();
  });

  it('displays DRAFT status when invoice is not finalized and not paid', () => {
    render(withSpecWrapper(<InvoiceStatus finalized={false} paid={false} />));

    const label = screen.getByTestId('invoice-status-label');
    expect(label).toBeTruthy();
    expect(label).toHaveTextContent('DRAFT');
  });

  it('displays FINALIZED status when invoice is finalized but not paid', () => {
    render(withSpecWrapper(<InvoiceStatus finalized={true} paid={false} />));

    const label = screen.getByTestId('invoice-status-label');
    expect(label).toBeTruthy();
    expect(label).toHaveTextContent('FINALIZED');
  });

  it('displays PAID status when invoice is paid', () => {
    render(withSpecWrapper(<InvoiceStatus finalized={true} paid={true} />));

    const label = screen.getByTestId('invoice-status-label');
    expect(label).toBeTruthy();
    expect(label).toHaveTextContent('PAID');
  });

  it('displays PAID status even when finalized is false but paid is true', () => {
    render(withSpecWrapper(<InvoiceStatus finalized={false} paid={true} />));

    const label = screen.getByTestId('invoice-status-label');
    expect(label).toBeTruthy();
    expect(label).toHaveTextContent('PAID');
  });
});
