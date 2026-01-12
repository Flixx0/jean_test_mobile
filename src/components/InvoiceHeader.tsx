import { Button, XStack } from '@ui/index';
import { Icon } from '@components/Icon';
import { InvoiceStatus } from '@components/InvoiceStatus';

type InvoiceHeaderProps = {
  finalized: boolean;
  paid: boolean;
  onEdit: () => void;
  onDelete: () => void;
  canDelete: boolean;
};

export const InvoiceHeader = ({
  finalized,
  paid,
  onEdit,
  onDelete,
  canDelete,
}: InvoiceHeaderProps) => {
  return (
    <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <InvoiceStatus finalized={finalized} paid={paid} />
      <XStack gap="$2">
        {!paid && !finalized ? (
          <Button
            size="$3"
            circular
            onPress={onEdit}
            bg="$color10"
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.2}
            shadowRadius={4}
            elevation={4}>
            <Icon name="Edit3" size={18} color="$color1" />
          </Button>
        ) : null}
        {canDelete ? (
          <Button
            size="$3"
            circular
            onPress={onDelete}
            bg="$red10"
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.2}
            shadowRadius={4}
            elevation={4}>
            <Icon name="Trash2" size={18} color="$color1" />
          </Button>
        ) : null}
      </XStack>
    </XStack>
  );
};
