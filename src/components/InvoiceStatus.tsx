import { useMemo } from 'react';
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
  const label = getStatusLabel(status);

  const { bgColor, textColor } = useMemo(() => {
    switch (status) {
      case 'paid':
        return { bgColor: '$green5', textColor: '$green11' };
      case 'finalized':
        return { bgColor: '$accent5', textColor: '$accent11' };
      case 'draft':
      default:
        return { bgColor: '$gray5', textColor: '$gray11' };
    }
  }, [status]);

  return (
    <XStack style={styles.container} bg={bgColor as any} px="$2" py="$1" rounded="$2">
      <Text fontSize="$2" fontWeight="600" color={textColor as any}>
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
