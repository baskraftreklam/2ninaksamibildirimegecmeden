// src/components/Header.js
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Header({ title = 'Talepify', onMenu, onFilter }) {
  // Header yüksekliği = 56; logo otomatik oranla sığsın
  const LOGO_HEIGHT = 26; // header içinde ideal
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: '#0b1724' }}>
      <View
        style={{
          height: 56,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 14,
          backgroundColor: '#0b1724',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,0.06)',
        }}
      >
        {/* Sol: Logo */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image
            source={require('../assets/images/logo.png')}
            style={{ height: LOGO_HEIGHT, aspectRatio: 4, resizeMode: 'contain' }}
          />
          <Text style={{ color: '#e11d2e', fontWeight: '800', fontSize: 18 }}>{title}</Text>
        </View>

        {/* Sağ: Menü + Filtre */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            onPress={onFilter}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: '#e11d2e',
              borderRadius: 12,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Filtre</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onMenu} style={{ padding: 6 }}>
            <Ionicons name="menu" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
