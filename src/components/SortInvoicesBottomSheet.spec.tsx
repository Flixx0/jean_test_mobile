import { render, screen, waitFor } from '@testing-library/react-native';
import { SortInvoicesBottomSheet } from '@components/SortInvoicesBottomSheet';
import { withSpecWrapper } from '../specs/wrapper';

// Suppress act warnings from Tamagui Sheet animations
// These warnings are expected with animated components and don't affect test functionality
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn((message?: any, ...optionalParams: any[]) => {
    const messageStr = String(message || '');
    if (
      messageStr.includes(
        'An update to Animated(View) inside a test was not wrapped in act(...)',
      ) ||
      messageStr.includes('act(...)')
    ) {
      return;
    }
    originalError(message, ...optionalParams);
  });
});

afterAll(() => {
  console.error = originalError;
});

describe('SortInvoicesBottomSheet', () => {
  it('renders sort invoices bottom sheet when open', async () => {
    const mockOnSortChange = jest.fn();
    const mockOnClose = jest.fn();
    render(
      withSpecWrapper(
        <SortInvoicesBottomSheet
          isOpen={true}
          sortOption="date-desc"
          onSortChange={mockOnSortChange}
          onClose={mockOnClose}
        />,
      ),
    );

    await waitFor(() => {
      expect(screen.getByTestId('sort-invoices-bottom-sheet-title')).toBeTruthy();
    });
  });

  it('displays the correct title', async () => {
    const mockOnSortChange = jest.fn();
    const mockOnClose = jest.fn();
    render(
      withSpecWrapper(
        <SortInvoicesBottomSheet
          isOpen={true}
          sortOption="date-desc"
          onSortChange={mockOnSortChange}
          onClose={mockOnClose}
        />,
      ),
    );

    await waitFor(() => {
      const title = screen.getByTestId('sort-invoices-bottom-sheet-title');
      expect(title).toBeTruthy();
      expect(title).toHaveTextContent('Sort invoices by');
    });
  });

  it('displays all sort options', async () => {
    const mockOnSortChange = jest.fn();
    const mockOnClose = jest.fn();
    render(
      withSpecWrapper(
        <SortInvoicesBottomSheet
          isOpen={true}
          sortOption="date-desc"
          onSortChange={mockOnSortChange}
          onClose={mockOnClose}
        />,
      ),
    );

    await waitFor(() => {
      expect(screen.getByTestId('sort-invoices-option-date-desc')).toBeTruthy();
      expect(screen.getByTestId('sort-invoices-option-date-asc')).toBeTruthy();
      expect(screen.getByTestId('sort-invoices-option-total-desc')).toBeTruthy();
      expect(screen.getByTestId('sort-invoices-option-total-asc')).toBeTruthy();
      expect(screen.getByTestId('sort-invoices-option-paid')).toBeTruthy();
      expect(screen.getByTestId('sort-invoices-option-finalized')).toBeTruthy();
      expect(screen.getByTestId('sort-invoices-option-draft')).toBeTruthy();
    });
  });

  it('displays correct labels for sort options', async () => {
    const mockOnSortChange = jest.fn();
    const mockOnClose = jest.fn();
    render(
      withSpecWrapper(
        <SortInvoicesBottomSheet
          isOpen={true}
          sortOption="date-desc"
          onSortChange={mockOnSortChange}
          onClose={mockOnClose}
        />,
      ),
    );

    await waitFor(() => {
      expect(screen.getByTestId('sort-invoices-option-label-date-desc')).toHaveTextContent('Date');
      expect(screen.getByTestId('sort-invoices-option-label-total-desc')).toHaveTextContent(
        'Amount',
      );
      expect(screen.getByTestId('sort-invoices-option-label-paid')).toHaveTextContent('Paid first');
    });
  });
});
