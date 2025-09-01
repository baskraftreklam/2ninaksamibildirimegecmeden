# TalepifyApp - React Native Portföy Yönetim Uygulaması

Bu proje, GitHub'daki [NAT-VE-GECMEDEN](https://github.com/baskraftreklam/NAT-VE-GECMEDEN.git) projesinden esinlenerek geliştirilmiş, React Native ile yazılmış bir portföy yönetim uygulamasıdır.

## 🚀 Özellikler

### 🔐 Kimlik Doğrulama Sistemi
- Firebase Authentication entegrasyonu
- Kullanıcı kayıt ve giriş
- Rol tabanlı yetkilendirme (Üye, Yönetici, Süper Yönetici)
- Güvenli rota koruması

### 📱 Portföy Yönetimi
- Portföy ekleme, düzenleme ve silme
- Görsel yönetimi
- Durum takibi (Aktif, Beklemede, Pasif)
- Detaylı portföy bilgileri

### 🎯 Akıllı Eşleştirme Sistemi
- Konum bazlı eşleştirme
- Fiyat uyumluluğu analizi
- Özellik bazlı eşleştirme
- Uyumluluk skoru hesaplama

### 💳 Abonelik Sistemi
- Farklı plan seçenekleri (Ücretsiz, Temel, Premium, Kurumsal)
- Plan yükseltme ve düşürme
- Kullanım limitleri
- Otomatik yenileme

### 🛡️ Güvenlik ve Yetkilendirme
- MemberRoute - Sadece üyeler için
- SuperAdminRoute - Sadece süper yöneticiler için
- Güvenli veri erişimi

## 🛠️ Teknolojiler

- **React Native** - Mobil uygulama geliştirme
- **Firebase** - Backend ve kimlik doğrulama
- **React Navigation** - Navigasyon yönetimi
- **Context API** - Durum yönetimi
- **UI Kitten** - UI bileşenleri

## 📦 Kurulum

### Gereksinimler
- Node.js (>=18)
- React Native CLI
- Android Studio / Xcode
- Firebase projesi

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd TalepifyApp
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Firebase yapılandırması**
- Firebase Console'dan yeni proje oluşturun
- `google-services.json` (Android) ve `GoogleService-Info.plist` (iOS) dosyalarını indirin
- Proje klasörlerine yerleştirin

4. **Uygulamayı çalıştırın**
```bash
# Android
npm run android

# iOS
npm run ios
```

## 🏗️ Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir bileşenler
│   ├── PortfolioCard.js    # Portföy kartı
│   ├── DisplayMap.js       # Harita görüntüleme
│   ├── Header.js           # Başlık bileşeni
│   ├── MemberRoute.js      # Üye rota koruması
│   └── SuperAdminRoute.js  # Süper admin rota koruması
├── context/             # Context API
│   └── AuthContext.js      # Kimlik doğrulama durumu
├── navigation/          # Navigasyon
│   ├── MainTabs.js         # Ana tab navigasyonu
│   └── RootNavigator.js    # Kök navigasyon
├── screens/             # Ekranlar
│   ├── PortfolioList.js    # Portföy listesi
│   ├── AddPortfolio.js     # Portföy ekleme
│   ├── Home.js             # Ana sayfa
│   └── Profile.js          # Profil
├── services/            # Servisler
│   ├── firebase.js         # Firebase yapılandırması
│   └── firestore.js        # Firestore işlemleri
├── theme/               # Tema ve stiller
│   ├── theme.js            # Tema yapılandırması
│   └── theme.json          # Tema verileri
└── utils/               # Yardımcı fonksiyonlar
    ├── matchingLogic.js    # Eşleştirme algoritması
    └── subscription.js     # Abonelik sistemi
```

## 🔧 Yapılandırma

### Firebase Yapılandırması
`src/services/firebase.js` dosyasında Firebase yapılandırmanızı güncelleyin:

```javascript
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
```

### Tema Yapılandırması
`src/theme/theme.js` dosyasında renk ve stil ayarlarını özelleştirebilirsiniz.

## 📱 Kullanım

### Portföy Ekleme
1. "Portföy Ekle" sekmesine gidin
2. Gerekli bilgileri doldurun
3. Görselleri ekleyin
4. Kaydedin

### Eşleştirme
1. "Portföyler" sekmesinde portföylerinizi görüntüleyin
2. Sistem otomatik olarak uyumlu portföyleri önerir
3. Uyumluluk skorlarına göre sıralama yapın

### Abonelik Yönetimi
1. "Profil" sekmesine gidin
2. "Abonelik" bölümünden planınızı yönetin
3. Plan yükseltme/düşürme işlemlerini yapın

## 🔒 Güvenlik

- Tüm API çağrıları Firebase güvenlik kuralları ile korunur
- Kullanıcı verileri şifrelenir
- Rol tabanlı erişim kontrolü
- Güvenli rota koruması

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- Proje Linki: [https://github.com/baskraftreklam/NAT-VE-GECMEDEN.git](https://github.com/baskraftreklam/NAT-VE-GECMEDEN.git)
- Sorularınız için issue açın

## 🙏 Teşekkürler

- [NAT-VE-GECMEDEN](https://github.com/baskraftreklam/NAT-VE-GECMEDEN.git) projesi için ilham
- React Native topluluğu
- Firebase ekibi

---

**Not:** Bu proje geliştirme aşamasındadır. Production kullanımı için ek güvenlik önlemleri ve testler gereklidir.
