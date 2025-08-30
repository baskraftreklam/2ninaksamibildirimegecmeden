import { Linking, Alert } from 'react-native';

// Telefon numarasını temizle (sadece rakamları al)
export const cleanPhoneNumber = (phone = '') => {
  return String(phone).replace(/\D+/g, '');
};

// WhatsApp için telefon numarasını formatla
export const formatWhatsAppNumber = (phone) => {
  const cleaned = cleanPhoneNumber(phone);
  if (!cleaned) return '';
  
  // Türkiye formatı için
  if (cleaned.startsWith('90') && cleaned.length === 12) return cleaned;
  if (cleaned.startsWith('0') && cleaned.length === 11) return `9${cleaned}`;
  if (cleaned.length === 10) return `90${cleaned}`;
  
  return cleaned;
};

// Telefon arama fonksiyonu
export const makePhoneCall = async (phoneNumber) => {
  try {
    const cleanedNumber = cleanPhoneNumber(phoneNumber);
    if (!cleanedNumber) {
      Alert.alert('Hata', 'Geçerli bir telefon numarası bulunamadı.');
      return;
    }

    const phoneUrl = `tel:${cleanedNumber}`;
    const canOpen = await Linking.canOpenURL(phoneUrl);
    
    if (canOpen) {
      await Linking.openURL(phoneUrl);
    } else {
      Alert.alert('Hata', 'Telefon uygulaması açılamadı.');
    }
  } catch (error) {
    console.error('Telefon arama hatası:', error);
    Alert.alert('Hata', 'Telefon arama başlatılamadı.');
  }
};

// WhatsApp mesajı gönderme fonksiyonu
export const sendWhatsAppMessage = async (phoneNumber, message = '') => {
  try {
    const whatsappNumber = formatWhatsAppNumber(phoneNumber);
    if (!whatsappNumber) {
      Alert.alert('Hata', 'Geçerli bir WhatsApp numarası bulunamadı.');
      return;
    }

    const whatsappUrl = `whatsapp://send?phone=${whatsappNumber}${message ? `&text=${encodeURIComponent(message)}` : ''}`;
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
    } else {
      // WhatsApp yüklü değilse web versiyonunu aç
      const webUrl = `https://wa.me/${whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
      await Linking.openURL(webUrl);
    }
  } catch (error) {
    console.error('WhatsApp mesaj hatası:', error);
    Alert.alert('Hata', 'WhatsApp mesajı gönderilemedi.');
  }
};

// E-posta gönderme fonksiyonu
export const sendEmail = async (email, subject = '', body = '') => {
  try {
    if (!email) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi bulunamadı.');
      return;
    }

    const mailUrl = `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}${body ? `${subject ? '&' : '?'}body=${encodeURIComponent(body)}` : ''}`;
    const canOpen = await Linking.canOpenURL(mailUrl);
    
    if (canOpen) {
      await Linking.openURL(mailUrl);
    } else {
      Alert.alert('Hata', 'E-posta uygulaması açılamadı.');
    }
  } catch (error) {
    console.error('E-posta gönderme hatası:', error);
    Alert.alert('Hata', 'E-posta gönderilemedi.');
  }
};

// Sosyal medya linklerini açma
export const openSocialMedia = async (url, platform) => {
  try {
    if (!url) {
      Alert.alert('Hata', `${platform} linki bulunamadı.`);
      return;
    }

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Hata', `${platform} uygulaması açılamadı.`);
    }
  } catch (error) {
    console.error(`${platform} açma hatası:`, error);
    Alert.alert('Hata', `${platform} açılamadı.`);
  }
};

// İletişim seçenekleri menüsü
export const showContactOptions = (contactInfo) => {
  const { phone, email, whatsapp, instagram, facebook, youtube } = contactInfo;
  
  const options = [];
  
  if (phone) {
    options.push({ title: '📞 Ara', onPress: () => makePhoneCall(phone) });
  }
  
  if (whatsapp || phone) {
    options.push({ 
      title: '💬 WhatsApp', 
      onPress: () => sendWhatsAppMessage(whatsapp || phone) 
    });
  }
  
  if (email) {
    options.push({ title: '📧 E-posta', onPress: () => sendEmail(email) });
  }
  
  if (instagram) {
    options.push({ 
      title: '📷 Instagram', 
      onPress: () => openSocialMedia(instagram, 'Instagram') 
    });
  }
  
  if (facebook) {
    options.push({ 
      title: '👥 Facebook', 
      onPress: () => openSocialMedia(facebook, 'Facebook') 
    });
  }
  
  if (youtube) {
    options.push({ 
      title: '📺 YouTube', 
      onPress: () => openSocialMedia(youtube, 'YouTube') 
    });
  }
  
  return options;
};
