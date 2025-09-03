# Bildirim Sistemi - TalepifyApp

## Genel Bakış

Bu bildirim sistemi, portföy ve talep güncellemelerini takip eder ve belirli aralıklarla kullanıcılara hatırlatma bildirimleri gönderir.

## Özellikler

### Portföy Bildirimleri
- **10. gün**: İlk hatırlatma bildirimi
- **20. gün**: İkinci hatırlatma bildirimi
- **30. gün**: Üçüncü hatırlatma bildirimi
- **45. gün**: Son bildirim + portföy gizlenir

### Talep Bildirimleri
- **10. gün**: İlk hatırlatma bildirimi
- **20. gün**: İkinci hatırlatma bildirimi
- **30. gün**: Üçüncü hatırlatma bildirimi
- **45. gün**: Son bildirim + talep gizlenir

## Bildirim Mesajları

### Portföy Mesajları
- **10, 20, 30. gün**: "Hey [İsim] Merhaba, [Portföy Başlığı] portföyünü [X] gündür güncellemedin. Hatırlatmak istedim. Lütfen kontrol et."
- **45. gün**: "Hey [İsim] Merhaba, [Portföy Başlığı] portföyün 45 gündür güncellenmedi. Portföy portföy havuzundan gizlendi. Lütfen kontrol et."

### Talep Mesajları
- **10, 20, 30. gün**: "Hey [İsim] Merhaba, [Talep Başlığı] talebini [X] gündür güncellemedin. Hatırlatmak istedim. Lütfen kontrol et."
- **45. gün**: "Hey [İsim] Merhaba, [Talep Başlığı] talebini 45 gündür güncellenmedi. Talep talep havuzundan gizlendi. Lütfen kontrol et."

## Teknik Detaylar

### Servisler

#### 1. NotificationService (`src/services/notificationService.js`)
- Push notification gönderimi
- Bildirim kanalları oluşturma
- Mesaj formatlaması
- Bildirim durumu takibi

#### 2. ReminderScheduler (`src/services/reminderScheduler.js`)
- Zamanlayıcı yönetimi (her 1 saatte bir kontrol)
- Portföy ve talep hatırlatma kontrolü
- Güncelleme tarihi hesaplama
- Otomatik gizleme işlemleri

### Entegrasyon

#### Portföy Ekleme
- `AddPortfolio.js` ekranında yeni portföy eklendiğinde
- `reminderScheduler.addPortfolio()` çağrılır

#### Talep Ekleme
- `RequestForm.js` ekranında yeni talep eklendiğinde
- `reminderScheduler.addRequest()` çağrılır

#### Uygulama Başlangıcı
- `App.js` dosyasında `useEffect` ile bildirim sistemi başlatılır
- Uygulama kapanırken sistem durdurulur

## Test Etme

### Test Ekranı
- Profile ekranında 🧪 butonuna tıklayarak `NotificationTest` ekranına gidin
- Farklı bildirim türlerini test edin
- Zamanlayıcıyı manuel olarak kontrol edin

### Test Butonları
1. **Portföy Bildirimi Test (10. gün)**: Tek portföy bildirimi gönderir
2. **Talep Bildirimi Test (20. gün)**: Tek talep bildirimi gönderir
3. **Tüm Günler Test**: 10, 20, 30, 45. günler için tüm bildirimleri gönderir
4. **Zamanlayıcı Manuel Kontrol**: Hatırlatma sistemini manuel olarak çalıştırır

## Kurulum

### Gerekli Paketler
```bash
npm install @react-native-community/push-notification-ios react-native-push-notification @notifee/react-native
```

### Android İzinleri
`android/app/src/main/AndroidManifest.xml` dosyasına eklenen izinler:
```xml
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
```

## Çalışma Mantığı

1. **Portföy/Talep Eklendiğinde**: Sistem otomatik olarak takip listesine eklenir
2. **Her Saat Kontrol**: Sistem her saat başı güncelleme tarihlerini kontrol eder
3. **Bildirim Gönderimi**: Gerekli günlerde bildirim gönderilir ve kaydedilir
4. **Otomatik Gizleme**: 45. günde portföy/talep otomatik olarak gizlenir

## Özelleştirme

### Bildirim Aralıkları
`src/services/reminderScheduler.js` dosyasında `REMINDER_DAYS` array'ini değiştirerek:
```javascript
this.REMINDER_DAYS = [10, 20, 30, 45]; // Varsayılan değerler
```

### Kontrol Sıklığı
`startScheduler()` fonksiyonunda interval süresini değiştirerek:
```javascript
// Her 1 saatte bir kontrol (varsayılan)
this.checkInterval = setInterval(() => {
  this.checkAllReminders();
}, 60 * 60 * 1000); // 1 saat

// Her 30 dakikada bir kontrol için:
// }, 30 * 60 * 1000); // 30 dakika
```

### Mesaj Formatları
`src/services/notificationService.js` dosyasında `getPortfolioMessage` ve `getRequestMessage` fonksiyonlarını düzenleyerek.

## Sorun Giderme

### Bildirim Gelmiyor
1. Bildirim izinlerinin verildiğinden emin olun
2. Uygulama arka planda çalışıyor mu kontrol edin
3. Test ekranından manuel test yapın

### Sistem Çalışmıyor
1. Console loglarını kontrol edin
2. `reminderScheduler.manualCheck()` ile manuel kontrol yapın
3. Uygulamayı yeniden başlatın

## Gelecek Geliştirmeler

- [ ] Firebase Cloud Messaging entegrasyonu
- [ ] Bildirim tercihleri (kullanıcı bazlı)
- [ ] E-posta bildirimleri
- [ ] SMS bildirimleri
- [ ] Bildirim geçmişi
- [ ] Bildirim istatistikleri
