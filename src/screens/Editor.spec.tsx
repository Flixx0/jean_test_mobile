import { render, screen } from '@testing-library/react-native';
import { EditorScreen } from '@screens/Editor';
import { withSpecWrapper } from '../specs/wrapper';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: jest.fn(() => ({
    params: {},
  })),
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  })),
}));

jest.mock('@hooks/useSubmitInvoice', () => ({
  useSubmitInvoice: jest.fn(() => ({
    onSubmit: jest.fn(),
    isSubmitting: false,
  })),
}));

jest.mock('@queries/useInvoice', () => ({
  useInvoiceOptional: jest.fn(() => ({
    data: null,
  })),
}));

describe('Editor', () => {
  it('renders create invoice screen', () => {
    render(withSpecWrapper(<EditorScreen />));

    const titles = screen.getAllByText('Create Invoice');
    expect(titles.length).toBeGreaterThan(0);
  });

  it('displays editor status field in create mode', () => {
    render(withSpecWrapper(<EditorScreen />));

    expect(screen.getByTestId('editor-status-field')).toBeTruthy();
  });

  it('displays editor customer field', () => {
    render(withSpecWrapper(<EditorScreen />));

    expect(screen.getByTestId('editor-customer-field')).toBeTruthy();
  });

  it('displays editor date fields', () => {
    render(withSpecWrapper(<EditorScreen />));

    expect(screen.getByTestId('editor-date-fields')).toBeTruthy();
  });

  it('displays editor invoice lines', () => {
    render(withSpecWrapper(<EditorScreen />));

    expect(screen.getByTestId('editor-invoice-lines')).toBeTruthy();
  });

  it('does not display editor total when total price is 0', () => {
    render(withSpecWrapper(<EditorScreen />));

    expect(screen.queryByTestId('editor-total')).toBeNull();
  });

  it('displays editor submit button', () => {
    render(withSpecWrapper(<EditorScreen />));

    expect(screen.getByTestId('editor-submit-button')).toBeTruthy();
  });
});
