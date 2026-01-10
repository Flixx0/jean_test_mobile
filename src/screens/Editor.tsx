import { Button, YStack } from '@ui/index';

export const EditorScreen = () => {
  const onCreateInvoice = () => {
    // TODO: Implement
  };

  return (
    <YStack gap="$4" style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <Button onPress={onCreateInvoice}>Create invoice</Button>
    </YStack>
  );
};
