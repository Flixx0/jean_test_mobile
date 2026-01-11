import { Text, XStack, YStack } from '@ui/index';

type InvoiceDatesProps = {
  date: string | null;
  deadline: string | null;
  isOverdue: boolean;
};

export const InvoiceDates = ({ date, deadline, isOverdue }: InvoiceDatesProps) => {
  return (
    <YStack gap="$2">
      <XStack style={{ justifyContent: 'space-between' }}>
        <Text fontSize="$2" color="$color11">
          Issued on
        </Text>
        <Text fontSize="$3" color="$color12" fontWeight="500">
          {date}
        </Text>
      </XStack>
      {deadline ? (
        <XStack style={{ justifyContent: 'space-between' }}>
          <Text fontSize="$2" color="$color11">
            Deadline
          </Text>
          <Text fontSize="$3" color={isOverdue ? '$red10' : '$color12'} fontWeight="500">
            {deadline}
          </Text>
        </XStack>
      ) : null}
    </YStack>
  );
};
