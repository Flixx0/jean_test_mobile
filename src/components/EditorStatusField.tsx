import { Control, FieldErrors } from 'react-hook-form';
import { Label, YStack } from '@ui/index';
import { StatusSelect, type InvoiceStatus } from '@components/StatusSelect';
import type { InvoiceFormData } from '@components/EditorInvoiceLines';

type EditorStatusFieldProps = {
  status: InvoiceStatus;
  onStatusChange: (status: InvoiceStatus) => void;
  errors: FieldErrors<InvoiceFormData>;
};

export const EditorStatusField = ({ status, onStatusChange, errors }: EditorStatusFieldProps) => {
  return (
    <YStack testID="editor-status-field" gap="$1">
      <Label testID="editor-status-field-label" htmlFor="status" fontSize="$4" color="$color12">
        Status
      </Label>
      <StatusSelect
        id="status"
        value={status}
        onChange={onStatusChange}
        placeholder="Select status"
      />
      {errors.finalized || errors.paid ? (
        <Label testID="editor-status-field-error" fontSize="$2" color="red">
          {errors.finalized?.message || errors.paid?.message}
        </Label>
      ) : null}
    </YStack>
  );
};
