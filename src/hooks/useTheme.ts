/**
 * Hook useTheme
 * Retorna a paleta de cores baseada na preferência do usuário (light/dark/system)
 */

import colors, { ThemeColors } from '../theme/colors';
import { useThemeContext } from '../contexts/ThemeContext';

export function useTheme(): ThemeColors {
  const { resolvedTheme } = useThemeContext();
  return resolvedTheme === 'dark' ? colors.dark : colors.light;
}

export default useTheme;
