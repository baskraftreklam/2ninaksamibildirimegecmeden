import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import SuccessModal, { showSuccess } from '../components/SuccessModal';

export default function Onboarding({ navigation }) {
  const handleStart = () => {
    showSuccess('Talepify\'a hoş geldiniz!');
    setTimeout(() => {
      navigation.replace('Login');
    }, 2000);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#07141e' }}>
      <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 12 }}>
        <Text>Hayalindeki evi bul!</Text>
      </Text>
      <Text style={{ color: '#9aa8b3', fontSize: 16, marginBottom: 24 }}>
        <Text>Talepify ile binlerce portföyü filtreleyerek hızlıca keşfet.</Text>
      </Text>
      <TouchableOpacity
        onPress={handleStart}
        style={{ backgroundColor: '#e11d2e', padding: 14, borderRadius: 14 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>
          <Text>Başlayalım</Text>
        </Text>
      </TouchableOpacity>

      {/* Success Modal */}
      <SuccessModal />
    </View>
  );
}
