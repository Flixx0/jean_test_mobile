import { useCallback, useMemo } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { RouteProp, useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { HomeStackParams } from '@navigators/HomeStack';
import { YStack, useTheme, Separator, Button } from '@ui/index';
import { InvoiceHeader } from '@components/InvoiceHeader';
import { InvoiceCustomerInfo } from '@components/InvoiceCustomerInfo';
import { InvoiceDates } from '@components/InvoiceDates';
import { InvoiceItemsList } from '@components/InvoiceItemsList';
import { InvoiceTotals } from '@components/InvoiceTotals';
import { useInvoice } from '@queries/useInvoice';
import { useDeleteInvoice } from '@queries/useDeleteInvoice';
import { WithSuspense } from '@utils/withSuspense';
import type { Components } from '@api/generated/client';
import { isBefore } from 'date-fns';
import { useUpdateInvoice } from '@queries/useUpdateInvoice';

// Extend Invoice type to include customer (API returns it but types don't reflect it)
type InvoiceWithCustomer = Components.Schemas.Invoice & {
  customer?: Components.Schemas.Customer;
};

const InvoiceData = ({ id }: { id: number }) => {
  const navigation = useNavigation<NavigationProp<HomeStackParams>>();
  const theme = useTheme();
  const { data } = useInvoice(id);
  const invoiceData = data as InvoiceWithCustomer;

  const deleteInvoiceMutation = useDeleteInvoice();
  const updateInvoiceMutation = useUpdateInvoice();

  const isOverdue = useMemo(
    () => Boolean(invoiceData.deadline && isBefore(new Date(invoiceData.deadline), new Date())),
    [invoiceData.deadline],
  );

  const handleEdit = useCallback(() => {
    navigation.navigate('EditInvoice', { id });
  }, [navigation, id]);

  const handleDelete = useCallback(() => {
    Alert.alert('Delete Invoice', 'Are you sure you want to delete this invoice?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteInvoiceMutation.mutate(id, {
            onSuccess: () => {
              navigation.goBack();
            },
            onError: (error) => {
              console.error('Error deleting invoice', error);
            },
          });
        },
      },
    ]);
  }, [deleteInvoiceMutation, id, navigation]);

  const handleChangeStatus = useCallback(() => {
    if (invoiceData.paid) return;

    if (invoiceData.finalized) {
      updateInvoiceMutation.mutate({
        id,
        data: {
          invoice: {
            id: invoiceData.id,
            customer_id: invoiceData.customer_id ?? undefined,
            finalized: invoiceData.finalized,
            paid: true,
            date: invoiceData.date ?? undefined,
            deadline: invoiceData.deadline ?? undefined,
          },
        },
      });
    } else {
      updateInvoiceMutation.mutate({
        id,
        data: {
          invoice: {
            id: invoiceData.id,
            customer_id: invoiceData.customer_id ?? undefined,
            finalized: true,
            paid: invoiceData.paid,
            date: invoiceData.date ?? undefined,
            deadline: invoiceData.deadline ?? undefined,
          },
        },
      });
    }
  }, [id, invoiceData, updateInvoiceMutation]);

  const canDelete = Boolean(!invoiceData.finalized && !invoiceData.paid);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background?.val }]}
      edges={['top']}>
      <YStack flex={1}>
        <YStack p="$4" gap="$4">
          <InvoiceHeader
            finalized={invoiceData.finalized}
            paid={invoiceData.paid}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canDelete={canDelete}
          />
          <InvoiceCustomerInfo
            customer={invoiceData.customer}
            customerId={invoiceData.customer_id}
          />
          <InvoiceDates
            date={invoiceData.date}
            deadline={invoiceData.deadline}
            isOverdue={isOverdue}
          />
        </YStack>
        <Separator />
        <YStack flex={1}>
          <InvoiceItemsList invoiceLines={invoiceData.invoice_lines || []} />
        </YStack>
        <Separator />
        <InvoiceTotals tax={invoiceData.tax} total={invoiceData.total} />
        {invoiceData.paid ? null : (
          <Button
            onPress={handleChangeStatus}
            bg="$accent1"
            color="$accent12"
            fontWeight="600"
            mx="$4">
            {invoiceData.finalized ? 'Set as paid' : 'Finalize invoice'}
          </Button>
        )}
      </YStack>
    </SafeAreaView>
  );
};

export const InvoiceScreen = () => {
  const { id } = useRoute<RouteProp<HomeStackParams, 'Invoice'>>().params;

  return (
    <WithSuspense>
      <InvoiceData id={id} />
    </WithSuspense>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 16,
  },
});
