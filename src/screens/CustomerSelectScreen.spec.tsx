import { render, screen } from '@testing-library/react-native';
import { CustomerSelectScreen } from '@screens/CustomerSelectScreen';
import { withSpecWrapper } from '../specs/wrapper';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: jest.fn(() => ({
    params: {
      onSelectCustomer: jest.fn(),
    },
  })),
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  })),
}));

jest.mock('@components/CustomersList', () => ({
  CustomersList: jest.fn(() => null),
}));

describe('CustomerSelectScreen', () => {
  it('renders customer select screen', () => {
    render(withSpecWrapper(<CustomerSelectScreen />));

    expect(screen.getByTestId('select-screen')).toBeTruthy();
  });

  it('displays the correct title', () => {
    render(withSpecWrapper(<CustomerSelectScreen />));

    expect(screen.getByTestId('select-screen-title')).toBeTruthy();
    expect(screen.getByTestId('select-screen-title')).toHaveTextContent('Select Customer');
  });

  it('displays search input', () => {
    render(withSpecWrapper(<CustomerSelectScreen />));

    expect(screen.getByTestId('select-screen-search-input')).toBeTruthy();
  });

  it('displays close button', () => {
    render(withSpecWrapper(<CustomerSelectScreen />));

    expect(screen.getByTestId('select-screen-close-button')).toBeTruthy();
  });
});
