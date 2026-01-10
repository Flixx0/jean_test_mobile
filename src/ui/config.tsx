import { defaultConfig } from '@tamagui/config/v4';
import { PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import { createTamagui, TamaguiProvider, Theme } from 'tamagui';
import { themes } from './themes';

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  themes,
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export const UIProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();
  const themeName = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={themeName}>
      <Theme name={themeName} key={themeName}>
        {children}
      </Theme>
    </TamaguiProvider>
  );
};
