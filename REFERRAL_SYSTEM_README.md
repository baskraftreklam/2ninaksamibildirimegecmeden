# Referans Sistemi - Talepify

Bu dokümantasyon, Talepify uygulamasına entegre edilen referans sistemi hakkında detaylı bilgi içermektedir.

## 🎯 Sistem Genel Bakış

Referans sistemi, mevcut kullanıcıların arkadaşlarını davet ederek hem kendilerine hem de yeni kullanıcılara avantaj sağlamasını amaçlar.

### 🔑 Temel Özellikler

- **Benzersiz Referans Kodu**: Her kullanıcı için otomatik olarak oluşturulan benzersiz kod
- **30 Gün Ödül**: Referans kodu ile kayıt olup abonelik alan her kullanıcı için referans kodu sahibine 30 gün ek süre
- **Sınırsız Referans**: Kullanıcılar istediği kadar referans yapabilir
- **Otomatik Bildirim**: Referans ödülü verildiğinde otomatik bildirim gönderimi

## 🚀 Nasıl Çalışır?

### 1. Referans Kodu Oluşturma
- Kullanıcı kayıt olduktan sonra profil sayfasından referans kodu oluşturabilir
- Kod otomatik olarak benzersiz şekilde oluşturulur
- Format: `ABC123DEF` (8+ karakter, sadece harf ve rakam)

### 2. Referans Kodu Paylaşımı
- Kullanıcı referans kodunu arkadaşlarıyla paylaşabilir
- Paylaşım butonu ile sosyal medya veya mesajlaşma uygulamalarında paylaşım
- Kopyalama butonu ile panoya kopyalama

### 3. Referans Kodu ile Kayıt
- Yeni kullanıcı kayıt olurken referans kodu girebilir
- Referans kodu opsiyonel alan olarak sunulur
- Kod geçerliliği kontrol edilir

### 4. Abonelik ve Ödül
- Referans kodu ile kayıt olan kullanıcı ücretli paket satın aldığında
- Referans kodu sahibine otomatik olarak 30 gün eklenir
- Bildirim gönderilir

## 📱 Kullanıcı Arayüzü

### Profil Sayfası
- Referans kodu gösterimi
- Referans sistemi bölümü
- Referans sistemi detay sayfasına yönlendirme

### Referans Sistemi Sayfası
- Referans kodu oluşturma
- Referans kodu paylaşımı
- Referans istatistikleri
- Nasıl çalışır açıklaması
- Avantajlar listesi

### Kayıt Sayfası
- Referans kodu giriş alanı (opsiyonel)
- Toggle buton ile referans kodu var/yok seçimi
- Bilgilendirici metin

## 🔧 Teknik Detaylar

### Dosya Yapısı
```
src/
├── utils/
│   └── referralSystem.js          # Referans sistemi yardımcı fonksiyonları
├── context/
│   └── AuthContext.js             # Referans sistemi entegrasyonu
├── screens/
│   ├── Register.js                # Referans kodu girişi
│   ├── Profile.js                 # Referans kodu gösterimi
│   └── ReferralSystem.js          # Referans sistemi ana sayfası
├── services/
│   └── notificationService.js     # Referans bildirimleri
└── navigation/
    └── RootNavigator.js           # Referans sistemi route'u
```

### Ana Sınıflar

#### ReferralRecord
Referans kaydını temsil eden sınıf:
- `referrerId`: Referans kodu sahibi
- `referredId`: Referans kodu ile kayıt olan kullanıcı
- `status`: Referans durumu (pending, completed, expired)
- `rewardDays`: Ödül günleri (varsayılan: 30)

#### ReferralManager
Referans sistemi işlemlerini yöneten sınıf:
- `generateUserReferralCode()`: Kullanıcı için referans kodu oluşturur
- `processReferral()`: Referans kodu ile kayıt olan kullanıcıyı işler
- `claimReferralReward()`: Abonelik satın alındığında ödülü verir
- `addRewardDaysToUser()`: Kullanıcıya ödül günleri ekler

### Veri Akışı

1. **Kayıt İşlemi**
   ```
   Kullanıcı Kayıt → Referans Kodu Kontrol → Referans Kaydı Oluştur
   ```

2. **Abonelik Satın Alma**
   ```
   Ödeme Başarılı → Referans Ödülü Kontrol → 30 Gün Ekle → Bildirim Gönder
   ```

3. **Bildirim Sistemi**
   ```
   Referans Ödülü → Bildirim Servisi → Push Notification → Kullanıcıya Bildirim
   ```

## 🔒 Güvenlik ve Doğrulama

### Referans Kodu Doğrulama
- En az 8 karakter uzunluğu
- Sadece harf ve rakam karakterleri
- Benzersizlik kontrolü
- Kendi referans kodunu kullanma engeli

### Veri Bütünlüğü
- Referans kayıtları için timestamp
- Durum takibi (pending → completed)
- Ödül verilme kontrolü (tekrar ödül verilmez)

## 📊 İstatistikler ve Takip

### Kullanıcı İstatistikleri
- Toplam referans sayısı
- Tamamlanan referans sayısı
- Kazanılan toplam gün sayısı
- Referans kodu durumu

### Sistem İstatistikleri
- Referans başarı oranı
- Ortalama ödül günleri
- En aktif referans kullanıcıları

## 🚧 Gelecek Geliştirmeler

### Planlanan Özellikler
- **Seviye Sistemi**: Farklı referans seviyeleri ve ödüller
- **Özel Kampanyalar**: Zaman sınırlı referans kampanyaları
- **Analitik Dashboard**: Detaylı referans analitikleri
- **Sosyal Entegrasyon**: Sosyal medya paylaşım butonları
- **QR Kod**: Referans kodu için QR kod oluşturma

### Teknik İyileştirmeler
- **Firebase Entegrasyonu**: Gerçek veritabanı bağlantısı
- **Real-time Updates**: Canlı referans takibi
- **Push Notifications**: Gerçek zamanlı bildirimler
- **Offline Support**: Çevrimdışı referans işlemleri

## 🐛 Bilinen Sorunlar

### Mevcut Durum
- Mock veri kullanımı (Firebase entegrasyonu bekleniyor)
- Bildirim servisi sınırlı (React Native Push Notification)
- Referans kodu kopyalama işlevi geliştirilmeli

### Çözüm Önerileri
- Firebase Firestore entegrasyonu
- Clipboard API kullanımı
- Gelişmiş bildirim sistemi

## 📞 Destek ve İletişim

Referans sistemi ile ilgili sorularınız için:
- **Geliştirici**: Talepify Development Team
- **Dokümantasyon**: Bu README dosyası
- **GitHub Issues**: Proje repository'sinde issue açabilirsiniz

## 📝 Lisans

Bu referans sistemi Talepify projesi kapsamında geliştirilmiştir ve aynı lisans koşullarına tabidir.

---

**Son Güncelleme**: Aralık 2024  
**Versiyon**: 1.0.0  
**Durum**: Aktif Geliştirme
