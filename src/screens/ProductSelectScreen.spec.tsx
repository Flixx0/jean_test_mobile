import { render, screen } from '@testing-library/react-native';
import { ProductSelectScreen } from '@screens/ProductSelectScreen';
import { withSpecWrapper } from '../specs/wrapper';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  })),
  useRoute: jest.fn(() => ({
    params: { index: 0 },
  })),
}));

jest.mock('@contexts/SelectionContext', () => ({
  SelectionProvider: ({ children }: { children: React.ReactNode }) => children,
  useSelection: jest.fn(() => ({
    selectedCustomer: null,
    selectedProducts: new Map(),
    setSelectedCustomer: jest.fn(),
    setSelectedProducts: jest.fn(),
    setProductAt: jest.fn(),
    clearSelection: jest.fn(),
  })),
}));

jest.mock('@components/ProductsList', () => ({
  ProductsList: jest.fn(() => null),
}));

describe('ProductSelectScreen', () => {
  it('renders product select screen', () => {
    render(withSpecWrapper(<ProductSelectScreen />));

    expect(screen.getByTestId('select-screen')).toBeTruthy();
  });

  it('displays the correct title', () => {
    render(withSpecWrapper(<ProductSelectScreen />));

    expect(screen.getByTestId('select-screen-title')).toBeTruthy();
    expect(screen.getByTestId('select-screen-title')).toHaveTextContent('Select Product');
  });

  it('displays search input', () => {
    render(withSpecWrapper(<ProductSelectScreen />));

    expect(screen.getByTestId('select-screen-search-input')).toBeTruthy();
  });

  it('displays close button', () => {
    render(withSpecWrapper(<ProductSelectScreen />));

    expect(screen.getByTestId('select-screen-close-button')).toBeTruthy();
  });
});
