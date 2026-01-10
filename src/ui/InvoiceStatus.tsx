import { Text, XStack } from 'tamagui';
import { StyleSheet } from 'react-native';

type InvoiceStatusProps = {
  finalized: boolean;
  paid: boolean;
};

type Status = 'draft' | 'finalized' | 'paid';

const getStatus = (finalized: boolean, paid: boolean): Status => {
  if (paid) {
    return 'paid';
  }
  if (finalized) {
    return 'finalized';
  }
  return 'draft';
};

const getStatusColor = (status: Status): string => {
  switch (status) {
    case 'draft':
      return 'gray';
    case 'finalized':
      return 'blue';
    case 'paid':
      return 'green';
    default:
      return 'gray';
  }
};

const getStatusLabel = (status: Status): string => {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'finalized':
      return 'Finalized';
    case 'paid':
      return 'Paid';
    default:
      return 'Unknown';
  }
};

export const InvoiceStatus = ({ finalized, paid }: InvoiceStatusProps) => {
  const status = getStatus(finalized, paid);
  const color = getStatusColor(status);
  const label = getStatusLabel(status);

  return (
    <XStack style={styles.container}>
      <Text fontSize="$2" fontWeight="600" color={color as 'gray' | 'blue' | 'green'}>
        {label.toUpperCase()}
      </Text>
    </XStack>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
