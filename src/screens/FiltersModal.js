// src/screens/FiltersModal.js
import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Modal } from 'react-native';
import SuccessModal, { showSuccess } from '../components/SuccessModal';

export default function FiltersModal({ visible, onClose, onApply, currentFilters = {} }) {
  const [status, setStatus] = React.useState(currentFilters.status || '');
  const [city, setCity] = React.useState(currentFilters.city || '');
  const [ptype, setPtype] = React.useState(currentFilters.ptype || '');
  const [minPrice, setMinPrice] = React.useState(currentFilters.minPrice ? String(currentFilters.minPrice) : '');
  const [maxPrice, setMaxPrice] = React.useState(currentFilters.maxPrice ? String(currentFilters.maxPrice) : '');

  const apply = () => {
    const filters = {
      status: status.trim() || null,
      city: city.trim() || null,
      ptype: ptype.trim() || null,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
    };

    onApply(filters);
    showSuccess('Filtreler uygulandı');
  };

  const clearAll = () => {
    setStatus('');
    setCity('');
    setPtype('');
    setMinPrice('');
    setMaxPrice('');
    showSuccess('Filtreler temizlendi');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex:1, backgroundColor: '#07141e' }}>
      <View style={{
        height: 56, flexDirection: 'row', alignItems:'center', justifyContent:'space-between',
        paddingHorizontal: 14, backgroundColor: 'rgba(7,20,30,0.92)'
      }}>
        <Text style={{ color:'#fff', fontWeight:'800', fontSize:18 }}>
          <Text>Filtreler</Text>
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={clearAll}>
            <Text style={{ color:'#9aa7b2', fontWeight:'600' }}>
              <Text>Temizle</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color:'#e11d2e', fontWeight:'700' }}>
              <Text>Kapat</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding:16 }}>
        {/* Status Filtresi */}
        <Text style={{ color:'#9aa7b2', marginBottom:6 }}>
          <Text>Durum</Text>
        </Text>
        <TextInput
          value={status}
          onChangeText={setStatus}
          placeholder="Satılık, Kiralık, Günlük..."
          placeholderTextColor="#7e8b95"
          style={{ backgroundColor:'rgba(255,255,255,0.08)', color:'#fff', padding:12, borderRadius:12, marginBottom:16 }}
        />

        {/* Şehir Filtresi */}
        <Text style={{ color:'#9aa7b2', marginBottom:6 }}>
          <Text>Şehir</Text>
        </Text>
        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="İstanbul, Ankara, İzmir..."
          placeholderTextColor="#7e8b95"
          style={{ backgroundColor:'rgba(255,255,255,0.08)', color:'#fff', padding:12, borderRadius:12, marginBottom:16 }}
        />

        {/* Property Type Filtresi */}
        <Text style={{ color:'#9aa7b2', marginBottom:6 }}>
          <Text>Emlak Tipi</Text>
        </Text>
        <TextInput
          value={ptype}
          onChangeText={setPtype}
          placeholder="Daire, Villa, Arsa, İşyeri..."
          placeholderTextColor="#7e8b95"
          style={{ backgroundColor:'rgba(255,255,255,0.08)', color:'#fff', padding:12, borderRadius:12, marginBottom:16 }}
        />

        {/* Fiyat Filtresi */}
        <Text style={{ color:'#9aa7b2', marginBottom:6 }}>
          <Text>Fiyat (₺)</Text>
        </Text>
        <View style={{ flexDirection:'row', gap:8, marginBottom:16 }}>
          <TextInput
            value={minPrice}
            onChangeText={setMinPrice}
            placeholder="Min"
            keyboardType="numeric"
            placeholderTextColor="#7e8b95"
            style={{ flex:1, backgroundColor:'rgba(255,255,255,0.08)', color:'#fff', padding:12, borderRadius:12 }}
          />
          <TextInput
            value={maxPrice}
            onChangeText={setMaxPrice}
            placeholder="Max"
            keyboardType="numeric"
            placeholderTextColor="#7e8b95"
            style={{ flex:1, backgroundColor:'rgba(255,255,255,0.08)', color:'#fff', padding:12, borderRadius:12 }}
          />
        </View>

        {/* Uygula Butonu */}
        <TouchableOpacity
          onPress={apply}
          style={{ backgroundColor:'#e11d2e', padding:14, borderRadius:14, marginTop:8 }}
        >
          <Text style={{ color:'#fff', textAlign:'center', fontWeight:'700' }}>
            <Text>Uygula</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Success Modal */}
      <SuccessModal />
      </View>
    </Modal>
  );
}
