import { render, screen } from '@testing-library/react-native';
import { EditorScreen } from '@screens/Editor';
import { withSpecWrapper } from '../specs/wrapper';

describe('Editor', () => {
  it('shows a button to create an invoice', async () => {
    render(withSpecWrapper(<EditorScreen />));

    expect(screen.getByText('Create invoice')).toBeTruthy();
  });
});
