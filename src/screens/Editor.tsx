import { useCallback, useState, useMemo } from 'react';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NavigationParams } from '@types';
import { Button, H2, Input, Label, Text, XStack, YStack, useTheme } from '@ui/index';
import { Icon } from '@components/Icon';
import { DatePickerInput } from '@components/DatePickerInput';
import { StatusSelect, type InvoiceStatus } from '@components/StatusSelect';
import { useCreateInvoice } from '@queries/useCreateInvoice';
import type { Paths } from '@api/generated/client';

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

const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const EditorScreen = () => {
  const navigation = useNavigation<NavigationProp<NavigationParams>>();
  const theme = useTheme();
  const createInvoiceMutation = useCreateInvoice();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, formState, setValue } = useForm<InvoiceFormData>({
    defaultValues: {
      customer_id: '',
      finalized: false,
      paid: false,
      date: formatDateForInput(new Date()),
      deadline: formatDateForInput(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 days from now
      invoice_lines_attributes: [{ product_id: '', quantity: '1' }],
    },
  });

  const finalized = useWatch({ control, name: 'finalized' });
  const paid = useWatch({ control, name: 'paid' });

  const currentStatus: InvoiceStatus = useMemo(() => {
    if (paid) return 'paid';
    if (finalized) return 'finalized';
    return 'draft';
  }, [finalized, paid]);

  const handleStatusChange = useCallback(
    (status: InvoiceStatus) => {
      switch (status) {
        case 'draft':
          setValue('finalized', false);
          setValue('paid', false);
          break;
        case 'finalized':
          setValue('finalized', true);
          setValue('paid', false);
          break;
        case 'paid':
          setValue('finalized', true);
          setValue('paid', true);
          break;
      }
    },
    [setValue],
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'invoice_lines_attributes',
  });

  const onSubmit = useCallback(
    async (data: InvoiceFormData) => {
      setIsSubmitting(true);
      try {
        const payload: Paths.PostInvoices.RequestBody = {
          invoice: {
            customer_id: Number.parseInt(data.customer_id, 10),
            finalized: data.finalized,
            paid: data.paid,
            date: data.date,
            deadline: data.deadline,
            invoice_lines_attributes: data.invoice_lines_attributes.map((line) => ({
              product_id: Number.parseInt(line.product_id, 10),
              quantity: line.quantity ? Number.parseInt(line.quantity, 10) : 1,
            })),
          },
        };

        const response = await createInvoiceMutation.mutateAsync(payload);
        if (response?.id) {
          Alert.alert('Invoice created successfully', `Invoice ID: ${response.id}`);
        } else {
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error creating invoice:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [createInvoiceMutation, navigation],
  );

  const addInvoiceLine = useCallback(() => {
    append({ product_id: '', quantity: '1' });
  }, [append]);

  const removeInvoiceLine = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
      }
    },
    [fields.length, remove],
  );

  // TODO: Add customer selection with query + add item with query + date picker
  // TODO: last: move this component to a component to be reusable with edit screen

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background?.val }]}
      edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { backgroundColor: theme.background?.val },
        ]}>
        <YStack gap="$3" p="$4">
          <H2 size="$7" fontWeight="600">
            Create Invoice
          </H2>
          <YStack gap="$1">
            <Label htmlFor="status" fontSize="$4" color="$color12">
              Status
            </Label>
            <StatusSelect
              id="status"
              value={currentStatus}
              onChange={handleStatusChange}
              placeholder="Select status"
            />
          </YStack>
          <YStack gap="$1">
            <Label htmlFor="customer_id" fontSize="$4">
              Customer ID
            </Label>
            <Controller
              control={control}
              name="customer_id"
              rules={{ required: 'Customer ID is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  id="customer_id"
                  placeholder="Enter customer ID"
                  keyboardType="number-pad"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
            />
            {formState.errors.customer_id && (
              <Text fontSize="$2" color="red">
                {formState.errors.customer_id.message}
              </Text>
            )}
          </YStack>
          <YStack gap="$1">
            <Label htmlFor="date" fontSize="$4" color="$color12">
              Date
            </Label>
            <Controller
              control={control}
              name="date"
              rules={{ required: 'Date is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <DatePickerInput
                  id="date"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="Select date"
                />
              )}
            />
            {formState.errors.date && (
              <Text fontSize="$2" color="red">
                {formState.errors.date.message}
              </Text>
            )}
          </YStack>
          <YStack gap="$1">
            <Label htmlFor="deadline" fontSize="$4" color="$color12">
              Deadline
            </Label>
            <Controller
              control={control}
              name="deadline"
              rules={{ required: 'Deadline is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <DatePickerInput
                  id="deadline"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="Select deadline"
                />
              )}
            />
            {formState.errors.deadline && (
              <Text fontSize="$2" color="red">
                {formState.errors.deadline.message}
              </Text>
            )}
          </YStack>
          <YStack gap="$1">
            <XStack style={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Label fontSize="$4" color="$color12">
                Invoice Lines
              </Label>
              <Button size="$3" onPress={addInvoiceLine}>
                <Icon name="Plus" size={16} color={theme.color12?.val} />
                <Text fontSize="$3" color="$color12" ml="$2">
                  Add Line
                </Text>
              </Button>
            </XStack>

            {fields.map((field, index) => (
              <XStack key={field.id} gap="$2" style={{ alignItems: 'flex-end' }}>
                <YStack flex={1} gap="$2">
                  <Label fontSize="$3" color="$color11">
                    Product ID
                  </Label>
                  <Controller
                    control={control}
                    name={`invoice_lines_attributes.${index}.product_id` as const}
                    rules={{ required: 'Product ID is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="Product ID"
                        keyboardType="number-pad"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </YStack>
                <YStack width={100} gap="$2">
                  <Label fontSize="$3" color="$color11">
                    Quantity
                  </Label>
                  <Controller
                    control={control}
                    name={`invoice_lines_attributes.${index}.quantity` as const}
                    rules={{ required: 'Quantity is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="Qty"
                        keyboardType="number-pad"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </YStack>
                {fields.length > 1 && (
                  <Button
                    size="$3"
                    circular
                    onPress={() => removeInvoiceLine(index)}
                    style={{
                      backgroundColor: theme.red2?.val,
                    }}>
                    <Icon name="X" size={16} color={theme.color12?.val} />
                  </Button>
                )}
              </XStack>
            ))}
          </YStack>
        </YStack>
      </ScrollView>
      <YStack p="$4">
        <Button size="$5" bg="$accent1" onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
          <Text fontSize="$5" fontWeight="600" color="$accent11">
            {isSubmitting ? 'Creating...' : 'Create Invoice'}
          </Text>
        </Button>
      </YStack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
