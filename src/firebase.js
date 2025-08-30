// src/firebase.js
// React Native CLI + Firebase Web SDK (v9) güvenli kurulum
// - Sadece resmi firebase paketini kullanıyoruz (@react-native-firebase/* KULLANMIYORUZ)
// - Auth kalıcılığı için AsyncStorage
// - Fast Refresh sırasında "already initialized" hatasına düşmemek için güvenli get/init

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// !!! BURAYI KENDİ PROJE BİLGİLERİNLE DOLDUR !!!
const firebaseConfig = {
  apiKey: "AIzaSyDCQN9dH-XX9mNvR7fNTnjuwoEDWwMYQVo",
  authDomain: "talepify-34470.firebaseapp.com",
  projectId: "talepify-34470",
  storageBucket: "talepify-34470.appspot.com", // DÜZELTİLMİŞ
  messagingSenderId: "75559979600",
  appId: "1:75559979600:web:3469de37858c9fcd75df55",
  measurementId: "G-RMEKMKR7HK"
};

// Tekil app instance
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth: önce initializeAuth dene; eğer zaten varsa getAuth ile mevcutu al
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e) {
  // initializeAuth zaten yapılmışsa buraya düşer
  auth = getAuth(app);
}

// Firestore instance
const db = getFirestore(app);

// Geliştirme logları
if (__DEV__) {
  console.log('[Firebase] App initialized:', app?.name);
  console.log('[Firebase] Auth ready with AsyncStorage');
}

export { app, auth, db };
