import { render, screen, fireEvent } from '@testing-library/react-native';
import { SelectScreen } from '@components/SelectScreen';
import { withSpecWrapper } from '../specs/wrapper';

describe('SelectScreen', () => {
  it('renders select screen with all required fields', () => {
    const mockOnClose = jest.fn();
    render(
      withSpecWrapper(
        <SelectScreen
          title="Select Customer"
          searchPlaceholder="Search customers"
          itemName="customer"
          onClose={mockOnClose}
          totalCount={10}>
          {() => <></>}
        </SelectScreen>,
      ),
    );

    expect(screen.getByTestId('select-screen')).toBeTruthy();
    expect(screen.getByTestId('select-screen-header')).toBeTruthy();
    expect(screen.getByTestId('select-screen-title')).toBeTruthy();
    expect(screen.getByTestId('select-screen-search-input')).toBeTruthy();
  });

  it('displays the correct title', () => {
    const mockOnClose = jest.fn();
    render(
      withSpecWrapper(
        <SelectScreen
          title="Select Customer"
          searchPlaceholder="Search customers"
          itemName="customer"
          onClose={mockOnClose}
          totalCount={10}>
          {() => <></>}
        </SelectScreen>,
      ),
    );

    const title = screen.getByTestId('select-screen-title');
    expect(title).toBeTruthy();
    expect(title).toHaveTextContent('Select Customer');
  });

  it('displays the correct count when totalCount is greater than 0', () => {
    const mockOnClose = jest.fn();
    render(
      withSpecWrapper(
        <SelectScreen
          title="Select Customer"
          searchPlaceholder="Search customers"
          itemName="customer"
          onClose={mockOnClose}
          totalCount={10}>
          {() => <></>}
        </SelectScreen>,
      ),
    );

    const count = screen.getByTestId('select-screen-count');
    expect(count).toBeTruthy();
    expect(count).toHaveTextContent('10 customers found');
  });

  it('displays singular form when totalCount is 1', () => {
    const mockOnClose = jest.fn();
    render(
      withSpecWrapper(
        <SelectScreen
          title="Select Customer"
          searchPlaceholder="Search customers"
          itemName="customer"
          onClose={mockOnClose}
          totalCount={1}>
          {() => <></>}
        </SelectScreen>,
      ),
    );

    const count = screen.getByTestId('select-screen-count');
    expect(count).toBeTruthy();
    expect(count).toHaveTextContent('1 customer found');
  });

  it('does not display count when totalCount is 0', () => {
    const mockOnClose = jest.fn();
    render(
      withSpecWrapper(
        <SelectScreen
          title="Select Customer"
          searchPlaceholder="Search customers"
          itemName="customer"
          onClose={mockOnClose}
          totalCount={0}>
          {() => <></>}
        </SelectScreen>,
      ),
    );

    expect(screen.queryByTestId('select-screen-count')).toBeNull();
  });

  it('calls onClose when close button is pressed', () => {
    const mockOnClose = jest.fn();
    render(
      withSpecWrapper(
        <SelectScreen
          title="Select Customer"
          searchPlaceholder="Search customers"
          itemName="customer"
          onClose={mockOnClose}
          totalCount={10}>
          {() => <></>}
        </SelectScreen>,
      ),
    );

    const closeButton = screen.getByTestId('select-screen-close-button');
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
