import React from 'react';
import { Layout, Text, Input, Button } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

export default function RequestScreen() {
  return (
    <Layout style={styles.container}>
      <Text category="h6" style={styles.title}>Talep Formu</Text>
      <Input label="Ad Soyad" style={styles.field} />
      <Input label="Telefon" keyboardType="phone-pad" style={styles.field} />
      <Input label="Talep Detayı" multiline textStyle={{ minHeight: 80 }} style={styles.field} />
      <Button>Gönder</Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { marginBottom: 12 },
  field: { marginBottom: 12 }
});
