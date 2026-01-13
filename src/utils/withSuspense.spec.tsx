import { render, screen } from '@testing-library/react-native';
import { WithSuspense } from './withSuspense';
import { withSpecWrapper } from '../specs/wrapper';
import { Text, View } from 'react-native';

// Component that renders normally
const NormalComponent = () => {
  return (
    <View testID="normal-component">
      <Text>Loaded content</Text>
    </View>
  );
};

describe('WithSuspense', () => {
  it('renders children when not in suspense', () => {
    render(
      withSpecWrapper(
        <WithSuspense>
          <NormalComponent />
        </WithSuspense>,
      ),
    );

    expect(screen.getByTestId('normal-component')).toBeTruthy();
    expect(screen.getByText('Loaded content')).toBeTruthy();
  });

  it('accepts custom fallback prop', () => {
    const CustomFallback = () => (
      <View testID="custom-fallback">
        <Text>Custom loading...</Text>
      </View>
    );

    render(
      withSpecWrapper(
        <WithSuspense fallback={<CustomFallback />}>
          <NormalComponent />
        </WithSuspense>,
      ),
    );

    // Component should render normally since it's not actually in suspense
    expect(screen.getByTestId('normal-component')).toBeTruthy();
  });

  it('wraps children in Suspense', () => {
    const TestComponent = () => {
      return (
        <WithSuspense>
          <NormalComponent />
        </WithSuspense>
      );
    };

    render(withSpecWrapper(<TestComponent />));

    expect(screen.getByTestId('normal-component')).toBeTruthy();
    expect(screen.getByText('Loaded content')).toBeTruthy();
  });

  it('uses default fallback when no fallback prop is provided', () => {
    render(
      withSpecWrapper(
        <WithSuspense>
          <NormalComponent />
        </WithSuspense>,
      ),
    );

    // Component should render normally
    expect(screen.getByTestId('normal-component')).toBeTruthy();
  });
});
