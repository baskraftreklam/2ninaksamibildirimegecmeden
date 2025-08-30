import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function Login({ navigation }) {
  const [phone, setPhone] = React.useState('');

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 16 }}>
        Telefon ile Giriş
      </Text>

      <Text style={{ color: '#9aa8b3', marginBottom: 8 }}>Telefon Numarası</Text>
      <TextInput
        placeholder="+90 5xx xxx xx xx"
        placeholderTextColor="#7e8b95"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={{
          backgroundColor: 'rgba(255,255,255,0.08)',
          color: '#fff',
          padding: 12,
          borderRadius: 12,
          marginBottom: 16
        }}
      />

      <TouchableOpacity
        onPress={() => navigation.replace('MainTabs')}
        style={{ backgroundColor: '#e11d2e', padding: 14, borderRadius: 14 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>OTP Gönder (Mock)</Text>
      </TouchableOpacity>
    </View>
  );
}
