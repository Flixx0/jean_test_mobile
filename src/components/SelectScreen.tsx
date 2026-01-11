import { useState, useEffect, ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, H2, Input, Text, XStack, YStack, useTheme } from '@ui/index';
import { Icon } from '@components/Icon';
import { WithSuspense } from '@utils/withSuspense';

type SelectScreenProps = {
  title: string;
  searchPlaceholder: string;
  itemName: string;
  onClose: () => void;
  children: (debouncedSearchQuery: string) => ReactNode;
  totalCount: number;
  onTotalCountChange: (count: number) => void;
};

export const SelectScreen = ({
  title,
  searchPlaceholder,
  itemName,
  onClose,
  children,
  totalCount,
  onTotalCountChange,
}: SelectScreenProps) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const DEBOUNCE_DELAY = 300;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background?.val }]}
      edges={['top', 'bottom']}>
      <YStack flex={1} style={{ backgroundColor: theme.background?.val }}>
        <YStack
          p="$4"
          gap="$3"
          style={{
            backgroundColor: theme.background?.val,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor?.val,
          }}>
          <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <H2 size="$6" fontWeight="600">
              {title}
            </H2>
            <Button size="$3" circular onPress={onClose}>
              <Icon name="X" size={18} color={theme.color12?.val} />
            </Button>
          </XStack>
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChangeText={(e) => {
              const text = typeof e === 'string' ? e : e.nativeEvent.text;
              setSearchQuery(text);
            }}
            autoFocus
          />
          {totalCount > 0 ? (
            <Text fontSize="$2" color="$color11">
              {totalCount} {itemName}
              {totalCount !== 1 ? 's' : ''} found
            </Text>
          ) : null}
        </YStack>
        <WithSuspense>{children(debouncedSearchQuery)}</WithSuspense>
      </YStack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
