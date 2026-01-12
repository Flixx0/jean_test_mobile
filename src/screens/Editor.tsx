import { useCallback, useState, useMemo } from 'react';
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
import { useInvoiceFormInitialization } from '@hooks/useInvoiceFormInitialization';
import type { Components } from '@api/generated/client';
import type { InvoiceStatus } from '@components/StatusSelect';

type EditorStackParams = {
  Editor: undefined;
  CustomerSelect: { onSelectCustomer: (customer: Components.Schemas.Customer) => void };
  ProductSelect: { onSelectProduct: (product: Components.Schemas.Product) => void };
};

type HomeStackParams = {
  EditInvoice: { id: number };
  CustomerSelect: { onSelectCustomer: (customer: Components.Schemas.Customer) => void };
  ProductSelect: { onSelectProduct: (product: Components.Schemas.Product) => void };
};

type InvoiceFormData = {
  customer_id: string;
  finalized: boolean;
  paid: boolean;
  date: string;
  deadline: string;
  invoice_lines_attributes: {
    id?: string;
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
  const route = useRoute();
  const invoiceId = (route.params as { id?: number })?.id;
  const isEditMode = Boolean(invoiceId);

  const editorNavigation = useNavigation<NavigationProp<EditorStackParams>>();
  const homeNavigation = useNavigation<NavigationProp<HomeStackParams>>();
  const navigation = (isEditMode ? homeNavigation : editorNavigation) as any;

  const theme = useTheme();
  const [selectedCustomer, setSelectedCustomer] = useState<Components.Schemas.Customer | null>(
    null,
  );
  const [selectedProducts, setSelectedProducts] = useState<Map<number, Components.Schemas.Product>>(
    new Map(),
  );
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
  });

  useInvoiceFormInitialization({
    isEditMode,
    invoiceId,
    reset,
    setSelectedCustomer,
    setSelectedProducts,
    setOriginalLineIds,
  });

  const addInvoiceLine = useCallback(() => {
    navigation.navigate('ProductSelect', {
      onSelectProduct: (product: Components.Schemas.Product) => {
        const newIndex = fields.length;
        append({ product_id: String(product.id), quantity: '1' });
        setSelectedProducts((prev) => {
          const newMap = new Map(prev);
          newMap.set(newIndex, product);
          return newMap;
        });
      },
    });
  }, [append, fields.length, navigation]);

  const removeInvoiceLine = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
        setSelectedProducts((prev) => {
          const newMap = new Map(prev);
          newMap.delete(index);
          // Reindex products after removal
          const reindexed = new Map<number, Components.Schemas.Product>();
          Array.from(newMap.entries())
            .sort(([a], [b]) => a - b)
            .forEach(([_oldIndex, product], newIndex) => {
              reindexed.set(newIndex, product);
            });
          return reindexed;
        });
      }
    },
    [fields.length, remove],
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
            onCustomerSelect={setSelectedCustomer}
            errors={formState.errors}
          />
          <EditorDateFields control={control} errors={formState.errors} />
          <EditorInvoiceLines
            control={control}
            fields={fields}
            selectedProducts={selectedProducts}
            onAddLine={addInvoiceLine}
            onRemoveLine={removeInvoiceLine}
            onProductSelect={(index, product) => {
              setSelectedProducts((prev) => {
                const newMap = new Map(prev);
                newMap.set(index, product);
                return newMap;
              });
            }}
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
