# 🏠 Talepify Mobile App

**Modern React Native Real Estate Management Application**

[![React Native](https://img.shields.io/badge/React%20Native-0.72+-blue.svg)](https://reactnative.dev/)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-green.svg)](https://reactnative.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📱 Proje Hakkında

Talepify Mobile App, emlak sektörü için geliştirilmiş modern bir React Native uygulamasıdır. Kullanıcıların portföy yönetimi, müşteri talepleri, randevu takibi ve harita entegrasyonu gibi özellikleri kullanmasını sağlar.

## ✨ Özellikler

### 🏠 **Portföy Yönetimi**
- Portföy listeleme ve detay görüntüleme
- Yeni portföy ekleme formu
- Arama ve filtreleme sistemi
- Favori portföyler
- Resim galerisi

### 📞 **İletişim Entegrasyonu**
- WhatsApp mesajlaşma
- Telefon arama
- E-posta gönderme
- Sosyal medya linkleri

### 🗺️ **Harita Entegrasyonu**
- Konum gösterimi
- Harita seçici
- Koordinat girişi
- Hızlı konum seçimi

### 📅 **Takvim ve Randevu**
- Haftalık takvim görünümü
- Randevu ekleme/düzenleme
- Randevu hatırlatmaları

### 📋 **Talep Havuzu**
- Müşteri talepleri listesi
- Talep detayları
- Durum takibi

### 🎨 **Modern UI/UX**
- Koyu tema desteği
- Tam kırmızı (#ff0000) renk teması
- Responsive tasarım
- Smooth animasyonlar

## 🚀 Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- React Native CLI
- Android Studio (Android için)
- Xcode (iOS için)

### Adımlar

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/baskraftreklam/YeniReactappTalepify.git
cd YeniReactappTalepify
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Android için**
```bash
npx react-native run-android
```

4. **iOS için**
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

## 📁 Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir bileşenler
│   ├── DisplayMap.js    # Harita gösterimi
│   ├── Header.js        # Uygulama başlığı
│   ├── ListingCard.js   # Portföy kartı
│   ├── MapPicker.js     # Harita seçici
│   └── SuccessModal.js  # Başarı modalı
├── navigation/          # Navigasyon yapısı
│   ├── MainTabs.js      # Ana tab navigasyonu
│   └── RootNavigator.js # Kök navigasyon
├── screens/             # Ekran bileşenleri
│   ├── Home.js          # Ana sayfa
│   ├── PropertyDetail.js # Portföy detayı
│   ├── AddPortfolio.js  # Portföy ekleme
│   ├── Calendar.js      # Takvim
│   ├── DemandPool.js    # Talep havuzu
│   └── ...
├── services/            # Servis katmanı
│   └── firestore.js     # Firebase entegrasyonu
├── theme/               # Tema sistemi
│   └── theme.js         # Renk ve stil tanımları
└── utils/               # Yardımcı fonksiyonlar
    └── contactUtils.js  # İletişim yardımcıları
```

## 🎨 Tema Sistemi

Uygulama, tutarlı bir tasarım için merkezi tema sistemi kullanır:

```javascript
// src/theme/theme.js
export const theme = {
  colors: {
    primary: '#ff0000',        // Ana kırmızı renk
    background: '#07141e',     // Koyu arka plan
    cardBg: '#0f1a23',         // Kart arka planı
    text: '#ffffff',           // Ana metin
    textSecondary: '#cccccc',  // İkincil metin
    border: 'rgba(255,255,255,0.1)', // Kenarlık
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  }
};
```

## 📱 Ekranlar

### 🏠 Ana Sayfa (Home)
- Portföy listesi
- Arama ve filtreleme
- Pull-to-refresh
- Favori sistemi

### 📄 Portföy Detayı (PropertyDetail)
- Resim galerisi
- Özellik listesi
- Konum haritası
- İletişim butonları

### ➕ Portföy Ekleme (AddPortfolio)
- Kapsamlı form
- Harita seçici
- Resim yükleme
- Validasyon

### 📅 Takvim (Calendar)
- Haftalık görünüm
- Randevu yönetimi
- Modal form

### 📋 Talep Havuzu (DemandPool)
- Müşteri talepleri
- Durum filtreleme
- Detay görüntüleme

## 🔧 Teknik Özellikler

### 📦 Kullanılan Teknolojiler
- **React Native** - Cross-platform mobil geliştirme
- **React Navigation** - Navigasyon sistemi
- **Firebase** - Backend servisleri (mock)
- **Animated API** - Smooth animasyonlar
- **Linking API** - Harici uygulama entegrasyonu

### 🎯 Performans Optimizasyonları
- React.memo kullanımı
- useCallback ve useMemo hooks
- Lazy loading
- Image optimization

### 🔒 Güvenlik
- Input validasyonu
- Error handling
- Safe area handling

## 🚀 Gelecek Özellikler

- [ ] Push notifications
- [ ] Offline mode
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Payment integration
- [ ] Video integration
- [ ] Advanced search filters

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

- **Proje Sahibi:** [@baskraftreklam](https://github.com/baskraftreklam)
- **E-posta:** info@talepify.com
- **Website:** [talepify.com](https://talepify.com)

## 🙏 Teşekkürler

- React Native ekibine
- React Navigation ekibine
- Tüm katkıda bulunanlara

---

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**
