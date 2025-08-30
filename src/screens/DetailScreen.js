import React from 'react';
import { Layout, Text, Button, Card } from '@ui-kitten/components';
import { StyleSheet, Image } from 'react-native';

export default function DetailScreen({ route }) {
  const { id } = route.params || {};
  return (
    <Layout style={styles.container}>
      <Card style={styles.card}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200' }}
          style={styles.img}
        />
        <Text category="h6" style={{ marginTop: 8 }}>Portföy {id || ''}</Text>
        <Text appearance="hint">Sahibi: Görünebilir (Herkes)</Text>
        <Button style={{ marginTop: 12 }}>Talep Oluştur</Button>
      </Card>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { backgroundColor: 'rgba(19,42,59,0.55)', borderColor: '#132a3b' },
  img: { width: '100%', height: 180, borderRadius: 8 }
});
