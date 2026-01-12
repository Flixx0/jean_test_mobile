import { Button, Text } from '@ui/index';

type EditorSubmitButtonProps = {
  onSubmit: () => void;
  isSubmitting: boolean;
  isEditMode?: boolean;
};

const getButtonText = (isSubmitting: boolean, isEditMode: boolean): string => {
  if (isSubmitting) {
    return isEditMode ? 'Updating...' : 'Creating...';
  }
  return isEditMode ? 'Update Invoice' : 'Create Invoice';
};

export const EditorSubmitButton = ({
  onSubmit,
  isSubmitting,
  isEditMode = false,
}: EditorSubmitButtonProps) => {
  return (
    <Button size="$5" bg="$accent1" onPress={onSubmit} disabled={isSubmitting}>
      <Text fontSize="$5" fontWeight="600" color="$accent11">
        {getButtonText(isSubmitting, isEditMode)}
      </Text>
    </Button>
  );
};
