import { Platform }                 from 'react-native';
import { initializeApp, getApp, getApps } from 'firebase/app';
/* ---- side-effect import → registers the Firestore component ---------- */
import 'firebase/firestore';         // 👈 MUST be before initializeFirestore!
/* --------------------------------------------------------------------- */
import { getAuth }                  from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
} from 'firebase/firestore';
import { getStorage }               from 'firebase/storage';

const firebaseConfig = {
  apiKey:            'AIzaSyCq6QQAzeAjgbd5bYHwdn6Ebe1MlLHTdmA',
  authDomain:        'know-b4cee.firebaseapp.com',
  projectId:         'know-b4cee',
  storageBucket:     'know-b4cee.appspot.com',
  messagingSenderId: '1013086836066',
  appId:             '1:1013086836066:web:e111ad7bc3f6e74b71483b',
  measurementId:     'G-YQZD5C4XDF',
};

/** one (and only one) Firebase app */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/* ---------------- Auth ---------------- */
export const auth = getAuth(app);

/* --------------- Firestore ------------ */
initializeFirestore(app, {
  experimentalForceLongPolling: true,   // 🔑 React-Native networking
});
export const db = getFirestore(app);

/* --------------- Storage -------------- */
export const storage = getStorage(app);

export default app;
