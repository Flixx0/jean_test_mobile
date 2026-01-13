import { render, screen } from '@testing-library/react-native';
import { Icon } from '@components/Icon';
import { withSpecWrapper } from '../specs/wrapper';

describe('Icon', () => {
  it('renders icon with testID', () => {
    render(withSpecWrapper(<Icon name="Edit3" size={24} color="#000" />));

    expect(screen.getByTestId('icon-Edit3')).toBeTruthy();
  });

  it('renders different icons with different testIDs', () => {
    render(
      withSpecWrapper(
        <>
          <Icon name="Edit3" size={24} color="#000" />
          <Icon name="Trash2" size={24} color="#000" />
        </>,
      ),
    );

    expect(screen.getByTestId('icon-Edit3')).toBeTruthy();
    expect(screen.getByTestId('icon-Trash2')).toBeTruthy();
  });
});
