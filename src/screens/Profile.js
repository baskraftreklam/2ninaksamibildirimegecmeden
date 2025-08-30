import React from 'react';
import { View, Text } from 'react-native';

export default function Profile() {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text style={{ color:'#fff' }}>
        <Text>Profil (giriş sonrası bilgiler burada)</Text>
      </Text>
    </View>
  );
}
