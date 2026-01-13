import React from 'react';
import * as LucideIcons from '@tamagui/lucide-icons';

export type IconName = keyof typeof LucideIcons;

interface IconProps {
  name: IconName;
  color?: string;
  size?: number;
  [key: string]: unknown;
}

/**
 * Centralized Icon component to use Lucide icons in a type-safe way
 */
export const Icon: React.FC<IconProps> = ({ name, color, size = 24, ...props }) => {
  // eslint-disable-next-line import/namespace
  const IconComponent = LucideIcons[name] as React.ComponentType<{
    color?: string;
    size?: number;
    [key: string]: unknown;
  }>;

  if (!IconComponent) {
    console.warn(
      `Icon "${name}" not found. Available icons: ${Object.keys(LucideIcons).slice(0, 5).join(', ')}...`,
    );
    return null;
  }

  return <IconComponent testID={`icon-${name}`} color={color} size={size} {...props} />;
};
