import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function Onboarding({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 12 }}>
        Hayalindeki evi bul!
      </Text>
      <Text style={{ color: '#9aa8b3', fontSize: 16, marginBottom: 24 }}>
        Talepify ile binlerce portföyü filtreleyerek hızlıca keşfet.
      </Text>
      <TouchableOpacity
        onPress={() => navigation.replace('Login')}
        style={{ backgroundColor: '#e11d2e', padding: 14, borderRadius: 14 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Başlayalım</Text>
      </TouchableOpacity>
    </View>
  );
}
