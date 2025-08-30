// src/firebase.js
// React Native CLI + Firebase Web SDK (v9) Hermes uyumlu kurulum
// - Sadece resmi firebase paketini kullanıyoruz (@react-native-firebase/* KULLANMIYORUZ)
// - Auth kalıcılığı için AsyncStorage
// - Fast Refresh sırasında "already initialized" hatasına düşmemek için güvenli get/init
// - Hermes uyumluluk sorunu nedeniyle mock data kullanıyoruz

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

// Mock data
const mockData = [
  {
    id: '1',
    title: 'Lüks Villa - Beşiktaş',
    city: 'İstanbul',
    price: '2.500.000 ₺',
    status: 'satılık',
    ptype: 'villa'
  },
  {
    id: '2',
    title: 'Modern Daire - Kadıköy',
    city: 'İstanbul',
    price: '850.000 ₺',
    status: 'satılık',
    ptype: 'daire'
  },
  {
    id: '3',
    title: 'Günlük Kiralık - Sultanahmet',
    city: 'İstanbul',
    price: '500 ₺/gün',
    status: 'günlük',
    ptype: 'daire'
  },
  {
    id: '4',
    title: 'İşyeri - Şişli',
    city: 'İstanbul',
    price: '15.000 ₺/ay',
    status: 'kiralık',
    ptype: 'işyeri'
  },
  {
    id: '5',
    title: 'Arsa - Çeşme',
    city: 'İzmir',
    price: '1.200.000 ₺',
    status: 'satılık',
    ptype: 'arsa'
  }
];

// Mock Firestore - Hermes uyumluluk sorunu nedeniyle
const mockDb = {
  collection: (collectionName) => {
    console.log('[Mock Firestore] Collection called:', collectionName);
    return {
      where: (field, operator, value) => {
        console.log('[Mock Firestore] Where called:', field, operator, value);
        return {
          get: async () => {
            console.log('[Mock Firestore] Get called, returning', mockData.length, 'items');
            return {
              empty: false,
              docs: mockData.map(item => ({
                id: item.id,
                data: () => item
              }))
            };
          }
        };
      },
      get: async () => {
        console.log('[Mock Firestore] Get called, returning', mockData.length, 'items');
        return {
          empty: false,
          docs: mockData.map(item => ({
            id: item.id,
            data: () => item
          }))
        };
      }
    };
  }
};

// Geliştirme logları
if (__DEV__) {
  console.log('[Firebase] App initialized:', app?.name);
  console.log('[Firebase] Auth ready:', !!auth);
  console.log('[Firebase] Mock Firestore ready');
}

const db = mockDb;

export { app, auth, db }; 
