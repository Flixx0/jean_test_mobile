import { render, screen } from '@testing-library/react-native';
import { ProductsList } from '@components/ProductsList';
import { withSpecWrapper } from '../specs/wrapper';
import { useInfiniteProducts } from '@queries/useInfiniteProducts';
import type { Components } from '@api/generated/client';

jest.mock('@queries/useInfiniteProducts');
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

const mockUseInfiniteProducts = useInfiniteProducts as jest.MockedFunction<
  typeof useInfiniteProducts
>;

const mockProduct: Components.Schemas.Product = {
  id: 1,
  label: 'Test Product',
  unit: 'piece',
  vat_rate: '20',
  unit_price: '60.00',
  unit_price_without_tax: '50.00',
  unit_tax: '10.00',
};

describe('ProductsList', () => {
  beforeEach(() => {
    mockUseInfiniteProducts.mockReturnValue({
      data: {
        pages: [
          {
            products: [mockProduct],
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

  it('renders products list', () => {
    const mockOnSelectProduct = jest.fn();
    render(withSpecWrapper(<ProductsList searchQuery="" onSelectProduct={mockOnSelectProduct} />));

    expect(screen.getByTestId('products-list')).toBeTruthy();
  });

  it('renders empty state when no products', () => {
    mockUseInfiniteProducts.mockReturnValue({
      data: {
        pages: [
          {
            products: [],
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

    const mockOnSelectProduct = jest.fn();
    render(withSpecWrapper(<ProductsList searchQuery="" onSelectProduct={mockOnSelectProduct} />));

    expect(screen.getByText('No products found.')).toBeTruthy();
  });
});
