import { Control, FieldErrors } from 'react-hook-form';
import { Label, YStack } from '@ui/index';
import { StatusSelect, type InvoiceStatus } from '@components/StatusSelect';

type InvoiceFormData = {
  customer_id: string;
  finalized: boolean;
  paid: boolean;
  date: string;
  deadline: string;
  invoice_lines_attributes: {
    product_id: string;
    quantity: string;
  }[];
};

type EditorStatusFieldProps = {
  status: InvoiceStatus;
  onStatusChange: (status: InvoiceStatus) => void;
  errors: FieldErrors<InvoiceFormData>;
};

export const EditorStatusField = ({ status, onStatusChange, errors }: EditorStatusFieldProps) => {
  return (
    <YStack gap="$1">
      <Label htmlFor="status" fontSize="$4" color="$color12">
        Status
      </Label>
      <StatusSelect
        id="status"
        value={status}
        onChange={onStatusChange}
        placeholder="Select status"
      />
      {errors.finalized || errors.paid ? (
        <Label fontSize="$2" color="red">
          {errors.finalized?.message || errors.paid?.message}
        </Label>
      ) : null}
    </YStack>
  );
};
