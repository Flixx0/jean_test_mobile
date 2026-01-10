import { useInvoice } from '@queries/useInvoice';
import { RouteProp, useRoute } from '@react-navigation/native';
import { NavigationParams } from '@types';
import { H3, Text, XStack, YStack } from '@ui/index';
import { InvoiceStatus } from '@components/InvoiceStatus';
import { formatPriceWithCurrency } from '@utils/formatPrice';
import { WithSuspense } from '@utils/withSuspense';
import { StyleSheet } from 'react-native';

const InvoiceData = ({ id }: { id: number }) => {
  const { data } = useInvoice(id);

  return (
    <YStack flex={1} p="$4" style={styles.container}>
      <XStack justify="space-between">
        <H3 size="$3" fontWeight="600" color="black">
          Invoice #{data.id}
        </H3>
        <InvoiceStatus finalized={data.finalized} paid={data.paid} />
      </XStack>
      {data.customer_id ? (
        <Text fontSize="$3" color="black">
          Customer ID: {data.customer_id}
        </Text>
      ) : null}
      <Text fontSize="$3" color="black">
        Date: {data.date}
      </Text>
      <Text fontSize="$3" color="black">
        Deadline: {data.deadline}
      </Text>
      {data.tax ? (
        <Text fontSize="$3" color="black">
          Tax: {formatPriceWithCurrency(data.tax)}
        </Text>
      ) : null}
      {data.total ? (
        <Text fontSize="$3" color="black">
          Total: {formatPriceWithCurrency(data.total)}
        </Text>
      ) : null}
    </YStack>
  );
};

export const InvoiceScreen = () => {
  const { id } = useRoute<RouteProp<NavigationParams, 'Invoice'>>().params;

  return (
    <WithSuspense>
      <InvoiceData id={id} />
    </WithSuspense>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
});
