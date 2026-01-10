import { NavigationProp, useNavigation } from '@react-navigation/native';
import type { NavigationParams } from '@types';
import { Button, H1, Text, YStack } from '@ui/index';
import { useInvoices } from '@queries/useInvoices';
import { StyleSheet } from 'react-native';

export const HomeScreen = () => {
  const { navigate } = useNavigation<NavigationProp<NavigationParams>>();
  const { data, isLoading, error } = useInvoices({
    page: 1,
    perPage: 50,
    filter: JSON.stringify([]),
  });

  const count = data?.pagination?.total_entries ?? 0;

  return (
    <YStack gap="$4" style={styles.container}>
      <H1 size="$5" fontWeight="600" color="black">
        Pennylane Invoice Editor
      </H1>
      {isLoading && <Text color="black">Loading invoices...</Text>}
      {error && (
        <Text color="red">Error: {error instanceof Error ? error.message : 'Unknown error'}</Text>
      )}
      {!isLoading && !error && <Text color="black">We currently have {count} invoices.</Text>}
      <Button onPress={() => navigate('Editor')}>Create a new one</Button>
    </YStack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
