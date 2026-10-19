import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text accessibilityRole="header" style={styles.title}>BandCampNation</Text>
      <Text style={styles.body}>We are more than a dot.</Text>
      <Text style={styles.body}>Radio, reading and games for band life.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 24, gap: 16 },
  title: { color: '#071426', fontSize: 34, fontWeight: '900' },
  body: { color: '#172840', fontSize: 18, lineHeight: 28 },
});
