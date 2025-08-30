// src/screens/FiltersModal.js
import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';

export default function FiltersModal({ navigation }) {
  const [city, setCity] = React.useState('');
  const [min, setMin] = React.useState('');
  const [max, setMax] = React.useState('');

  const apply = () => {
    // Filtreleri MainTabs > Home ekranına gönderiyoruz
    const filters = {
      city: city.trim() || null,
      min: min ? Number(min) : null,
      max: max ? Number(max) : null,
    };

    // Home tab’ına param ile dön (RootNavigator içinde MainTabs var)
    navigation.navigate('MainTabs', {
      screen: 'Home',
      params: { filters },
      merge: true,
    });
  };

  return (
    <View style={{ flex:1, backgroundColor: '#07141e' }}>
      <View style={{
        height: 56, flexDirection: 'row', alignItems:'center', justifyContent:'space-between',
        paddingHorizontal: 14, backgroundColor: 'rgba(7,20,30,0.92)'
      }}>
        <Text style={{ color:'#fff', fontWeight:'800', fontSize:18 }}>Filtreler</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color:'#e11d2e', fontWeight:'700' }}>Kapat</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding:16 }}>
        <Text style={{ color:'#9aa8b3', marginBottom:6 }}>Şehir</Text>
        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="İstanbul"
          placeholderTextColor="#7e8b95"
          style={{ backgroundColor:'rgba(255,255,255,0.08)', color:'#fff', padding:12, borderRadius:12, marginBottom:12 }}
        />

        <Text style={{ color:'#9aa8b3', marginBottom:6 }}>Fiyat (₺)</Text>
        <View style={{ flexDirection:'row', gap:8 }}>
          <TextInput
            value={min}
            onChangeText={setMin}
            placeholder="min"
            keyboardType="numeric"
            placeholderTextColor="#7e8b95"
            style={{ flex:1, backgroundColor:'rgba(255,255,255,0.08)', color:'#fff', padding:12, borderRadius:12, marginBottom:12 }}
          />
          <TextInput
            value={max}
            onChangeText={setMax}
            placeholder="max"
            keyboardType="numeric"
            placeholderTextColor="#7e8b95"
            style={{ flex:1, backgroundColor:'rgba(255,255,255,0.08)', color:'#fff', padding:12, borderRadius:12, marginBottom:12 }}
          />
        </View>

        <TouchableOpacity
          onPress={apply}
          style={{ backgroundColor:'#e11d2e', padding:14, borderRadius:14, marginTop:8 }}
        >
          <Text style={{ color:'#fff', textAlign:'center', fontWeight:'700' }}>Uygula</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
