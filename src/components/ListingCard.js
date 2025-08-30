// src/components/ListingCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop';

export default function ListingCard({ item, onPress }) {
  const img = item?.image || item?.imageUrl || PLACEHOLDER;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        backgroundColor: 'rgba(17,28,40,0.96)',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <Image
        source={{ uri: img }}
        style={{ width: '100%', height: 180, backgroundColor: '#101820' }}
        resizeMode="cover"
      />
      <View style={{ padding: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Ionicons name="location-outline" size={16} color="#9aa8b3" />
          <Text style={{ color: '#9aa8b3', marginLeft: 6 }}>
            {item.city || 'Şehir'} • {item.district || 'İlçe'}
          </Text>
        </View>

        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
          {item.title || 'Başlık'}
        </Text>

        <Text style={{ color: '#e11d2e', fontWeight: '900', fontSize: 18, marginTop: 6 }}>
          {Number(item.price || 0).toLocaleString('tr-TR')} ₺
        </Text>

        <Text style={{ color: '#b7c3cc', marginTop: 4 }}>
          {(item.bedroom ?? 2)}+{(item.living ?? 1)} • {(item.size ?? 100)} m² • {item.type || 'Satılık'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
