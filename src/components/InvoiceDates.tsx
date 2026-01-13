import { Text, XStack, YStack } from '@ui/index';

type InvoiceDatesProps = {
  date: string | null;
  deadline: string | null;
  isOverdue: boolean;
};

export const InvoiceDates = ({ date, deadline, isOverdue }: InvoiceDatesProps) => {
  return (
    <YStack testID="invoice-dates" gap="$2">
      <XStack testID="invoice-dates-issued-row" style={{ justifyContent: 'space-between' }}>
        <Text testID="invoice-dates-issued-label" fontSize="$2" color="$color11">
          Issued on
        </Text>
        <Text testID="invoice-dates-issued-value" fontSize="$3" color="$color12" fontWeight="500">
          {date}
        </Text>
      </XStack>
      {deadline ? (
        <XStack testID="invoice-dates-deadline-row" style={{ justifyContent: 'space-between' }}>
          <Text testID="invoice-dates-deadline-label" fontSize="$2" color="$color11">
            Deadline
          </Text>
          <Text
            testID="invoice-dates-deadline-value"
            fontSize="$3"
            color={isOverdue ? '$red10' : '$color12'}
            fontWeight="500">
            {deadline}
          </Text>
        </XStack>
      ) : null}
    </YStack>
  );
};
