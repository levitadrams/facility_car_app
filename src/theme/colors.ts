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
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceHighlight: '#F8FAFC',
  primary: '#D4A017',
  primaryLight: '#FEF3C7',
  secondary: '#7C3AED',
  accent: '#F59E0B',
  text: '#1E293B',
  textMuted: '#64748B',
  textInverse: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  warning: '#D97706',
  success: '#059669',
  info: '#0891B2',
  overlay: 'rgba(0,0,0,0.4)',
  cardBg: '#FFFFFF',
  inputBg: '#F8FAFC',
  inputBorder: '#E2E8F0',
  shadow: '#000000',
  divider: '#E2E8F0',
  statusBar: '#FFFFFF',
  fab: '#D4A017',
  badgeSuccess: '#059669',
  badgeSuccessBg: '#D1FAE5',
  badgeWarning: '#D97706',
  badgeWarningBg: '#FEF3C7',
  badgeDanger: '#DC2626',
  badgeDangerBg: '#FEE2E2',
  badgeNeutral: '#64748B',
  badgeNeutralBg: '#F1F5F9',
};

const dark: ThemeColors = {
  background: '#0F172A',
  surface: '#1E293B',
  surfaceHighlight: '#334155',
  primary: '#FBBF24',
  primaryLight: '#78350F',
  secondary: '#A78BFA',
  accent: '#FBBF24',
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  textInverse: '#0F172A',
  border: '#334155',
  borderLight: '#1E293B',
  danger: '#EF4444',
  dangerLight: '#7F1D1D',
  warning: '#F59E0B',
  success: '#34D399',
  info: '#22D3EE',
  overlay: 'rgba(0,0,0,0.6)',
  cardBg: '#1E293B',
  inputBg: '#1E293B',
  inputBorder: '#334155',
  shadow: '#000000',
  divider: '#334155',
  statusBar: '#0F172A',
  fab: '#FBBF24',
  badgeSuccess: '#34D399',
  badgeSuccessBg: '#064E3B',
  badgeWarning: '#F59E0B',
  badgeWarningBg: '#78350F',
  badgeDanger: '#EF4444',
  badgeDangerBg: '#7F1D1D',
  badgeNeutral: '#94A3B8',
  badgeNeutralBg: '#1E293B',
};

export default {
  light,
  dark,
};
