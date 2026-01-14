import { useCallback, useState, useMemo, useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H2, YStack, XStack, Button, useTheme } from '@ui/index';
import { Icon } from '@components/Icon';
import { EditorStatusField } from '@components/EditorStatusField';
import { EditorCustomerField } from '@components/EditorCustomerField';
import { EditorDateFields } from '@components/EditorDateFields';
import { EditorInvoiceLines } from '@components/EditorInvoiceLines';
import { EditorTotal } from '@components/EditorTotal';
import { EditorSubmitButton } from '@components/EditorSubmitButton';
import { useSubmitInvoice } from '@hooks/useSubmitInvoice';
import { useInvoiceOptional } from '@queries/useInvoice';
import { useSelection } from '@contexts/SelectionContext';
import type { Components } from '@api/generated/client';
import type { InvoiceStatus } from '@components/StatusSelect';
import type { EditorStackParams } from '@navigators/EditorStack';
import type { HomeStackParams } from '@navigators/HomeStack';
import type { InvoiceFormData } from '@components/EditorInvoiceLines';

const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const EditorScreen = () => {
  const route = useRoute();
  const invoiceId = (route.params as { id?: number })?.id;
  const isEditMode = Boolean(invoiceId);

  const editorNavigation = useNavigation<NavigationProp<EditorStackParams>>();
  const homeNavigation = useNavigation<NavigationProp<HomeStackParams>>();
  const navigation = (isEditMode ? homeNavigation : editorNavigation) as any;

  const theme = useTheme();
  // Track original invoice line IDs to detect deletions
  const [originalLineIds, setOriginalLineIds] = useState<Set<number>>(new Set());

  const { control, handleSubmit, formState, setValue, reset } = useForm<InvoiceFormData>({
    defaultValues: {
      customer_id: '',
      finalized: false,
      paid: false,
      date: formatDateForInput(new Date()),
      deadline: formatDateForInput(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 days from now
      invoice_lines_attributes: [{ product_id: '', quantity: '1' }],
    },
  });

  const {
    selectedCustomer,
    selectedProducts,
    setSelectedCustomer,
    setSelectedProducts,
    setProductAt,
    clearSelection,
  } = useSelection();

  const invoiceQuery = useInvoiceOptional(invoiceId, isEditMode);
  const invoiceData = invoiceQuery.data || null;

  // Reset context and form on mount
  useEffect(() => {
    if (isEditMode && invoiceData) {
      const invoice = invoiceData as Components.Schemas.Invoice & {
        customer?: Components.Schemas.Customer;
      };

      if (invoice.customer) {
        setSelectedCustomer(invoice.customer);
      } else {
        setSelectedCustomer(null);
      }

      const lines = invoice.invoice_lines || [];
      const productsMap = new Map<number, Components.Schemas.Product>();
      const lineIds = new Set<number>();

      lines.forEach((line, index) => {
        if (line.product) {
          productsMap.set(index, line.product);
        }
        if (line.id) {
          lineIds.add(line.id);
        }
      });

      setSelectedProducts(productsMap);
      setOriginalLineIds(lineIds);

      reset({
        customer_id: invoice.customer_id ? String(invoice.customer_id) : '',
        finalized: invoice.finalized || false,
        paid: invoice.paid || false,
        date: invoice.date || formatDateForInput(new Date()),
        deadline:
          invoice.deadline || formatDateForInput(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
        invoice_lines_attributes:
          lines.length > 0
            ? lines.map((line) => ({
                id: line.id ? String(line.id) : undefined,
                product_id: line.product_id ? String(line.product_id) : '',
                quantity: line.quantity ? String(line.quantity) : '1',
              }))
            : [{ product_id: '', quantity: '1' }],
      });
    } else {
      clearSelection();
      setOriginalLineIds(new Set());
    }
  }, [isEditMode, invoiceData, reset, setSelectedCustomer, setSelectedProducts, clearSelection]);

  useEffect(() => {
    if (selectedCustomer) {
      setValue('customer_id', String(selectedCustomer.id));
    }
  }, [selectedCustomer, setValue]);

  useEffect(() => {
    selectedProducts.forEach((product, index) => {
      setValue(`invoice_lines_attributes.${index}.product_id` as const, String(product.id));
    });
  }, [selectedProducts, setValue]);

  const finalized = useWatch({ control, name: 'finalized' });
  const paid = useWatch({ control, name: 'paid' });
  const invoiceLines = useWatch({ control, name: 'invoice_lines_attributes' });

  const currentStatus: InvoiceStatus = useMemo(() => {
    if (paid) return 'paid';
    if (finalized) return 'finalized';
    return 'draft';
  }, [finalized, paid]);

  const totalPrice = useMemo(() => {
    let total = 0;
    invoiceLines?.forEach((line, index) => {
      const product = selectedProducts.get(index);
      if (product && line.quantity) {
        const quantity = Number.parseInt(line.quantity, 10) || 0;
        const unitPrice = Number.parseFloat(product.unit_price) || 0;
        total += unitPrice * quantity;
      }
    });
    return total;
  }, [invoiceLines, selectedProducts]);

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

  const { onSubmit, isSubmitting } = useSubmitInvoice({
    isEditMode,
    invoiceId,
    originalLineIds,
    navigation,
    reset,
  });

  const addInvoiceLine = useCallback(() => {
    const newIndex = fields.length;
    append({ product_id: '', quantity: '1' });
    navigation.navigate('ProductSelect', { index: newIndex });
  }, [fields.length, append, navigation]);

  const removeInvoiceLine = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
        setProductAt(index, null);
        const reindexed = new Map<number, Components.Schemas.Product>();
        selectedProducts.forEach((product, oldIndex) => {
          if (oldIndex < index) {
            reindexed.set(oldIndex, product);
          } else if (oldIndex > index) {
            reindexed.set(oldIndex - 1, product);
          }
        });
        setSelectedProducts(reindexed);
      }
    },
    [fields.length, remove, setProductAt, selectedProducts, setSelectedProducts],
  );

  const screenContent = (
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
          <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <H2 size="$7" fontWeight="600">
              {isEditMode ? 'Edit Invoice' : 'Create Invoice'}
            </H2>
            {isEditMode ? (
              <Button size="$3" circular onPress={() => navigation.goBack()}>
                <Icon name="X" size={18} color={theme.color12?.val} />
              </Button>
            ) : null}
          </XStack>
          {isEditMode ? null : (
            <EditorStatusField
              status={currentStatus}
              onStatusChange={handleStatusChange}
              errors={formState.errors}
            />
          )}
          <EditorCustomerField
            control={control}
            selectedCustomer={selectedCustomer}
            errors={formState.errors}
          />
          <EditorDateFields control={control} errors={formState.errors} />
          <EditorInvoiceLines
            control={control}
            fields={fields}
            selectedProducts={selectedProducts}
            onAddLine={addInvoiceLine}
            onRemoveLine={removeInvoiceLine}
            errors={formState.errors}
          />
        </YStack>
      </ScrollView>
      <YStack p="$4" gap="$3">
        <EditorTotal totalPrice={totalPrice} />
        <EditorSubmitButton
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
        />
      </YStack>
    </SafeAreaView>
  );

  return screenContent;
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
