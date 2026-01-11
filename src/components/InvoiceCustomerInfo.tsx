import { Text, XStack, YStack, useTheme } from '@ui/index';
import type { Components } from '@api/generated/client';

type Customer = Components.Schemas.Customer;

type InvoiceCustomerInfoProps = {
  customer?: Customer;
  customerId?: number | null;
};

export const InvoiceCustomerInfo = ({ customer, customerId }: InvoiceCustomerInfoProps) => {
  const theme = useTheme();

  if (customer) {
    return (
      <YStack
        p="$3"
        gap="$2"
        style={{
          backgroundColor: theme.color3?.val,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: theme.borderColor?.val,
        }}>
        <Text fontSize="$3" fontWeight="600" color="$color12">
          Bill To
        </Text>
        <YStack gap="$1">
          <Text fontSize="$4" fontWeight="600" color="$color12">
            {customer.first_name} {customer.last_name}
          </Text>
          {customer.address ? (
            <Text fontSize="$2" color="$color11">
              {customer.address}
            </Text>
          ) : null}
          <XStack gap="$1" style={{ flexWrap: 'wrap' }}>
            {customer.zip_code ? (
              <Text fontSize="$2" color="$color11">
                {customer.zip_code}
              </Text>
            ) : null}
            {customer.city ? (
              <Text fontSize="$2" color="$color11">
                {customer.city}
              </Text>
            ) : null}
          </XStack>
          {customer.country ? (
            <Text fontSize="$2" color="$color11">
              {customer.country}
              {customer.country_code ? ` (${customer.country_code})` : ''}
            </Text>
          ) : null}
        </YStack>
      </YStack>
    );
  }

  if (customerId) {
    return (
      <YStack
        p="$3"
        style={{
          backgroundColor: theme.backgroundHover?.val,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: theme.borderColor?.val,
        }}>
        <Text fontSize="$3" color="$color11">
          Customer ID: {customerId}
        </Text>
      </YStack>
    );
  }

  return null;
};
