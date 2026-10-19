import { useRouter } from 'expo-router';

import { AppScreen } from '@/components/AppScreen';
import { AppButton, PageHeader } from '@/components/ui';

export default function MissingScreen() {
  const router = useRouter();
  return <AppScreen><PageHeader eyebrow="BandCampNation" title="Page not found" description="Use Home or the menu to find radio, reading and games." /><AppButton label="Go Home" onPress={() => router.replace('/')} /></AppScreen>;
}
