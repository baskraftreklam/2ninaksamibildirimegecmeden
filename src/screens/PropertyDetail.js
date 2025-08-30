import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function PropertyDetail({ route, navigation }) {
  const { item } = route.params || {};
  if (!item) {
    return <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text style={{ color:'#fff' }}>Kayıt bulunamadı</Text>
    </View>
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ position: 'absolute', zIndex: 10, top: 22, left: 16, backgroundColor: 'rgba(0,0,0,0.35)', padding: 8, borderRadius: 24 }}
      >
        <Ionicons name="chevron-back" color="#fff" size={22} />
      </TouchableOpacity>

      <Image source={{ uri: item.image }} style={{ width: '100%', height: 260 }} />
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={{ color: '#e11d2e', fontWeight: '800', fontSize: 20 }}>
          {item.price.toLocaleString('tr-TR')} ₺
        </Text>
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18, marginTop: 6 }}>{item.title}</Text>
        <Text style={{ color: '#9aa8b3', marginTop: 6 }}>
          {item.city} • {item.district} • {item.size} m² • {item.bedroom}+{item.living}
        </Text>
        <Text style={{ color: '#cdd6dd', marginTop: 12, lineHeight: 20 }}>
          Figma’daki detay sayfasına benzer şekilde açıklamalar, özellik ikonları ve konum haritası burada yer alacak.
        </Text>

        <TouchableOpacity
          style={{ marginTop: 16, backgroundColor: '#e11d2e', padding: 14, borderRadius: 14 }}
          onPress={() => {}}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Danışmanla İletişim</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
