import { RouteProp, useRoute } from '@react-navigation/native';
import { NavigationParams } from '@types';
import { H1, Text, YStack } from '@ui/index';

export const InvoiceScreen = () => {
  const { id } = useRoute<RouteProp<NavigationParams, 'Invoice'>>().params;
  return (
    <YStack flex={1} style={{ alignItems: 'center', justifyContent: 'center' }}>
      <H1>Invoice</H1>
      <Text fontSize="$3" color="gray">
        {id}
      </Text>
    </YStack>
  );
};
