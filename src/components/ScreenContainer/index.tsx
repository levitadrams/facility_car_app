/**
 * ScreenContainer
 * Wrapper com SafeAreaView para evitar sobreposição com status bar e navigation bar
 */

import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
}

export default function ScreenContainer({
  children,
  style,
  edges = ['top', 'bottom', 'left', 'right'],
}: ScreenContainerProps) {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: theme.background }, style]}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
}
