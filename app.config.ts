import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Pennylane',
  slug: 'pennylane',
  version: '1.0.0',
  orientation: 'default',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  scheme: 'pennylane',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.pennylane',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#ffffff',
    },
    package: 'com.pennylane',
  },
  plugins: [
    'expo-asset',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#ffffff',
      },
    ],
  ],
  extra: {
    apiUrl: process.env.API_URL || 'https://jean-test-api.herokuapp.com/',
    apiToken: process.env.API_TOKEN || '',
  },
});
