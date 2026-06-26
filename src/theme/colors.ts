/**
 * Paletas de cores extraídas dos templates light/dark
 * Baseado nas imagens template-light.png e template-dark.png
 */

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceHighlight: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  text: string;
  textMuted: string;
  textInverse: string;
  border: string;
  borderLight: string;
  danger: string;
  dangerLight: string;
  warning: string;
  success: string;
  info: string;
  overlay: string;
  cardBg: string;
  inputBg: string;
  inputBorder: string;
  shadow: string;
  divider: string;
  statusBar: string;
  fab: string;
  badgeSuccess: string;
  badgeSuccessBg: string;
  badgeWarning: string;
  badgeWarningBg: string;
  badgeDanger: string;
  badgeDangerBg: string;
  badgeNeutral: string;
  badgeNeutralBg: string;
}

const light: ThemeColors = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceHighlight: '#F8FAFC',
  primary: '#FBBF24',
  primaryLight: '#FEF3C7',
  secondary: '#7C3AED',
  accent: '#FBBF24',
  text: '#000000',
  textMuted: '#4B5563',
  textInverse: '#111111',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',
  overlay: 'rgba(0,0,0,0.4)',
  cardBg: '#F9FAFB',
  inputBg: '#F9FAFB',
  inputBorder: '#E5E7EB',
  shadow: '#000000',
  divider: '#E5E7EB',
  statusBar: '#FFFFFF',
  fab: '#FBBF24',
  badgeSuccess: '#10B981',
  badgeSuccessBg: '#D1FAE5',
  badgeWarning: '#F59E0B',
  badgeWarningBg: '#FEF3C7',
  badgeDanger: '#EF4444',
  badgeDangerBg: '#FEE2E2',
  badgeNeutral: '#6B7280',
  badgeNeutralBg: '#F3F4F6',
};

const dark: ThemeColors = {
  background: '#3A3A3C',
  surface: '#1C1C1E',
  surfaceHighlight: '#2C2C2E',
  primary: '#FBBF24',
  primaryLight: '#78350F',
  secondary: '#A78BFA',
  accent: '#FBBF24',
  text: '#FFFFFF',
  textMuted: '#A1A1AA',
  textInverse: '#1C1C1E',
  border: '#E5E7EB',
  borderLight: '#1C1C1E',
  danger: '#F87171',
  dangerLight: '#7F1D1D',
  warning: '#FBBF24',
  success: '#4ADE80',
  info: '#22D3EE',
  overlay: 'rgba(0,0,0,0.6)',
  cardBg: '#1C1C1E',
  inputBg: '#2C2C2E',
  inputBorder: '#3A3A3C',
  shadow: '#000000',
  divider: '#2C2C2E',
  statusBar: '#1C1C1E',
  fab: '#FBBF24',
  badgeSuccess: '#4ADE80',
  badgeSuccessBg: '#064E3B',
  badgeWarning: '#FBBF24',
  badgeWarningBg: '#78350F',
  badgeDanger: '#F87171',
  badgeDangerBg: '#7F1D1D',
  badgeNeutral: '#A1A1AA',
  badgeNeutralBg: '#2C2C2E',
};

export default {
  light,
  dark,
};
