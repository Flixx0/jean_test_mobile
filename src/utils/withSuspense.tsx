import { Suspense, ReactNode } from 'react';
import { Spinner, YStack } from '@ui/index';

type WithSuspenseProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

const defaultFallback = (
  <YStack flex={1} style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Spinner size="large" />
  </YStack>
);

export const WithSuspense = ({ children, fallback = defaultFallback }: WithSuspenseProps) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};
