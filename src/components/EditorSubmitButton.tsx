import { Button, Text } from '@ui/index';

type EditorSubmitButtonProps = {
  onSubmit: () => void;
  isSubmitting: boolean;
};

export const EditorSubmitButton = ({ onSubmit, isSubmitting }: EditorSubmitButtonProps) => {
  return (
    <Button size="$5" bg="$accent1" onPress={onSubmit} disabled={isSubmitting}>
      <Text fontSize="$5" fontWeight="600" color="$accent11">
        {isSubmitting ? 'Creating...' : 'Create Invoice'}
      </Text>
    </Button>
  );
};
