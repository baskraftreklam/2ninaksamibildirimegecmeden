// React Native CLI + Firebase Web SDK (v9) Hermes uyumlu kurulum
// - Sadece resmi firebase paketini kullanıyoruz (@react-native-firebase/* KULLANMIYORUZ)
// - Auth kalıcılığı için AsyncStorage
// - Fast Refresh sırasında "already initialized" hatasına düşmemek için güvenli get/init

import { initializeApp, getApps, getApp} from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// !!! BURAYI KENDİ PROJE BİLGİLERİNLE DOLDUR !!!
const firebaseConfig = {
  apiKey: "AIzaSyDCQN9dH-XX9mNvR7fNTnjuwoEDWwMYQVo",
  authDomain: "talepify-34470.firebaseapp.com",
  projectId: "talepify-34470",
  storageBucket: "talepify-34470.appspot.com",
  messagingSenderId: "75559979600",
  appId: "1:75559979600:web:3469de37858c9fcd75df55",
  measurementId: "G-RMEKMKR7HK"
};

// Tekil app instance - Fast Refresh koruması
let app;
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
} catch (error) {
  console.error('[Firebase] App initialization error:', error);
  app = initializeApp(firebaseConfig);
}

// Auth: önce initializeAuth dene; eğer zaten varsa getAuth ile mevcutu al
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e) {
  try {
    auth = getAuth(app);
  } catch (error) {
    console.error('[Firebase] Auth initialization error:', error);
    auth = null;
  }
}







export { app, auth }; 
