import { Alert, Linking } from 'react-native';

import { SITE_ORIGIN } from '@/features/radio/service';

export async function openWebsite(path: string) {
  if (!path.startsWith('/') || path.startsWith('//')) return;
  try { await Linking.openURL(`${SITE_ORIGIN}${path}`); }
  catch { Alert.alert('Could not open the website', 'Check your connection or browser and try again.'); }
}
