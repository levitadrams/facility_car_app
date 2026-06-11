/**
 * Componente Avatar reutilizável
 * Exibição de iniciais ou imagens de perfil
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import theme from '../../theme';

interface AvatarProps {
  name?: string;
  imageUri?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
}

export default function Avatar({
  name,
  imageUri,
  size = 'md',
  backgroundColor,
  textColor,
  style,
}: AvatarProps) {
  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.avatarSm;
      case 'lg':
        return styles.avatarLg;
      case 'xl':
        return styles.avatarXl;
      default:
        return styles.avatarMd;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.textSm;
      case 'lg':
        return styles.textLg;
      case 'xl':
        return styles.textXl;
      default:
        return styles.textMd;
    }
  };

  const defaultBgColor = backgroundColor || theme.colors.primary[600];
  const defaultTextColor = textColor || theme.colors.white;

  return (
    <View
      style={[
        styles.avatar,
        getSizeStyle(),
        { backgroundColor: defaultBgColor },
        style,
      ]}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={[styles.image, getSizeStyle()]} />
      ) : (
        <Text style={[styles.text, getTextSizeStyle(), { color: defaultTextColor }]}>
          {name ? getInitials(name) : '?'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarSm: {
    width: 32,
    height: 32,
  },
  avatarMd: {
    width: 40,
    height: 40,
  },
  avatarLg: {
    width: 56,
    height: 56,
  },
  avatarXl: {
    width: 80,
    height: 80,
  },
  image: {
    resizeMode: 'cover',
  },
  text: {
    fontWeight: theme.typography.fontWeight.bold,
  },
  textSm: {
    fontSize: theme.typography.fontSize.sm,
  },
  textMd: {
    fontSize: theme.typography.fontSize.md,
  },
  textLg: {
    fontSize: theme.typography.fontSize.xl,
  },
  textXl: {
    fontSize: theme.typography.fontSize.xxl,
  },
});
