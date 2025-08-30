import React from 'react';
import { Layout, Text, Button, Select, SelectItem, IndexPath, Input } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

export default function FilterScreen() {
  const [categoryIndex, setCategoryIndex] = React.useState(new IndexPath(0));
  const [cityIndex, setCityIndex] = React.useState(new IndexPath(0));
  const categories = ['Satılık', 'Kiralık'];
  const cities = ['Samsun', 'İstanbul', 'Ankara', 'İzmir'];

  return (
    <Layout style={styles.container}>
      <Text category="h6" style={styles.title}>Detaylı Filtre</Text>

      <Select
        label="Kategori"
        selectedIndex={categoryIndex}
        onSelect={index => setCategoryIndex(index)}
        value={categories[categoryIndex.row]}
        style={styles.field}
      >
        {categories.map((c, i) => <SelectItem key={i} title={c} />)}
      </Select>

      <Select
        label="Şehir"
        selectedIndex={cityIndex}
        onSelect={index => setCityIndex(index)}
        value={cities[cityIndex.row]}
        style={styles.field}
      >
        {cities.map((c, i) => <SelectItem key={i} title={c} />)}
      </Select>

      <Input label="Min Fiyat" keyboardType="numeric" style={styles.field} />
      <Input label="Max Fiyat" keyboardType="numeric" style={styles.field} />

      <Button style={{ marginTop: 8 }}>Filtreyi Uygula</Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { marginBottom: 12 },
  field: { marginBottom: 12 }
});
