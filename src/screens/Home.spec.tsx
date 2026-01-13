import { render, screen } from '@testing-library/react-native';
import { HomeScreen } from '@screens/Home';
import { withSpecWrapper } from '../specs/wrapper';
import type { Components } from '@api/generated/client';
import { useInfiniteInvoices } from '@queries/useInfiniteInvoices';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  })),
}));

jest.mock('@queries/useInfiniteInvoices', () => ({
  useInfiniteInvoices: jest.fn(() => ({
    data: {
      pages: [
        {
          invoices: [
            {
              id: 1,
              customer_id: 1,
              finalized: false,
              paid: false,
              date: '2024-01-01',
              deadline: '2024-01-31',
              total: 100,
              customer: {
                id: 1,
                first_name: 'John',
                last_name: 'Doe',
              } as Components.Schemas.Customer,
            },
          ],
          pagination: {
            page: 1,
            total_pages: 1,
            total_entries: 1,
          },
        },
      ],
    },
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    refetch: jest.fn(),
  })),
}));

describe('Home', () => {
  it('renders home screen', () => {
    render(withSpecWrapper(<HomeScreen />));

    expect(screen.getByText('Your invoices')).toBeTruthy();
  });

  it('displays total invoices count', () => {
    render(withSpecWrapper(<HomeScreen />));

    expect(screen.getByText('1 total invoices')).toBeTruthy();
  });

  it('displays invoice cards when invoices are available', () => {
    render(withSpecWrapper(<HomeScreen />));

    expect(screen.getByTestId('invoice-card')).toBeTruthy();
  });

  it('displays empty state when no invoices', () => {
    (useInfiniteInvoices as jest.Mock).mockReturnValueOnce({
      data: {
        pages: [
          {
            invoices: [],
            pagination: {
              page: 1,
              total_pages: 1,
              total_entries: 0,
            },
          },
        ],
      },
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      refetch: jest.fn(),
    });

    render(withSpecWrapper(<HomeScreen />));

    expect(screen.getByText('No invoices found.')).toBeTruthy();
    expect(screen.getByText('Create a new invoice')).toBeTruthy();
  });
});
