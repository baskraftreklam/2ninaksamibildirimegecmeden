// src/components/FilterPill.js
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default function FilterPill({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        minWidth: 90,
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 12,
        borderRadius: 18,
        backgroundColor: active ? '#e11d2e' : '#2a3440',
        borderWidth: active ? 0 : 1,
        borderColor: 'rgba(255,255,255,0.10)',
      }}
    >
      <Text style={{ color: active ? '#fff' : '#d6dee5', fontWeight: '700', fontSize: 13 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
