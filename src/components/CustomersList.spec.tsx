import { render, screen } from '@testing-library/react-native';
import { CustomersList } from '@components/CustomersList';
import { withSpecWrapper } from '../specs/wrapper';
import { useInfiniteCustomers } from '@queries/useInfiniteCustomers';
import type { Components } from '@api/generated/client';

jest.mock('@queries/useInfiniteCustomers');
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

const mockUseInfiniteCustomers = useInfiniteCustomers as jest.MockedFunction<
  typeof useInfiniteCustomers
>;

const mockCustomer: Components.Schemas.Customer = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  address: '123 Main St',
  zip_code: '12345',
  city: 'Paris',
  country: 'France',
  country_code: 'FR',
};

describe('CustomersList', () => {
  beforeEach(() => {
    mockUseInfiniteCustomers.mockReturnValue({
      data: {
        pages: [
          {
            customers: [mockCustomer],
            pagination: {
              total_entries: 1,
              total_pages: 1,
              current_page: 1,
              per_page: 30,
            },
          },
        ],
        pageParams: [],
      },
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    } as any);
  });

  it('renders customers list', () => {
    const mockOnSelectCustomer = jest.fn();
    render(
      withSpecWrapper(<CustomersList searchQuery="" onSelectCustomer={mockOnSelectCustomer} />),
    );

    expect(screen.getByTestId('customers-list')).toBeTruthy();
  });

  it('renders empty state when no customers', () => {
    mockUseInfiniteCustomers.mockReturnValue({
      data: {
        pages: [
          {
            customers: [],
            pagination: {
              total_entries: 0,
              total_pages: 0,
              current_page: 1,
              per_page: 30,
            },
          },
        ],
        pageParams: [],
      },
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    const mockOnSelectCustomer = jest.fn();
    render(
      withSpecWrapper(<CustomersList searchQuery="" onSelectCustomer={mockOnSelectCustomer} />),
    );

    expect(screen.getByText('No customers found.')).toBeTruthy();
  });
});
