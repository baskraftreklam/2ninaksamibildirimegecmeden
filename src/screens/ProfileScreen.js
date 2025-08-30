import React from 'react';
import { Layout, Text, Button, Avatar } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <Layout style={styles.container}>
      <View style={styles.header}>
        <Avatar
          source={{ uri: 'https://ui-avatars.com/api/?name=Armenkul&background=E11D48&color=fff' }}
          size="giant"
          style={{ marginRight: 12 }}
        />
        <View>
          <Text category="s1" style={{ color: '#E11D48', fontWeight: 'bold' }}>Armenkul</Text>
          <Text appearance="hint">Danışman</Text>
        </View>
      </View>

      <Button style={{ marginTop: 16 }} status="primary">Profili Düzenle</Button>
      <Button style={{ marginTop: 8 }} status="basic">Abonelik</Button>
      <Button style={{ marginTop: 8 }} status="danger">Çıkış Yap</Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center' }
});
