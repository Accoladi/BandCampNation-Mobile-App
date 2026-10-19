import { Platform } from 'react-native';

export const colors = {
  navy: '#071426',
  navyRaised: '#102B4B',
  navyDeep: '#071426',
  ink: '#071426',
  inkBlue: '#0A2340',
  text: '#101820',
  textMuted: '#415873',
  blue: '#006DFF',
  blueBright: '#1769E8',
  red: '#075CC7',
  redAccent: '#075CC7',
  gold: '#F8C94D',
  goldBright: '#F8C94D',
  paper: '#F7FBFF',
  paperAlt: '#EAF4FF',
  white: '#FFFFFF',
  onDarkMuted: '#DCE3E9',
  border: '#D8DFE6',
  borderOnDark: '#FFFFFF26',
  progressTrack: '#C8C0B2',
  success: '#1F6B45',
  successTint: '#F0D98B',
} as const;

export const displayFont = Platform.select({
  ios: 'System',
  android: 'sans-serif-condensed',
  default: 'sans-serif',
});

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
} as const;

export const radii = {
  small: 3,
  medium: 12,
  large: 16,
  pill: 999,
} as const;

export const sizes = {
  headerHeight: 76,
  minimumTouchTarget: 48,
  contentMaxWidth: 720,
} as const;
