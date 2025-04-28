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
  apiKey:            '',
  authDomain:        '',
  projectId:         '',
  storageBucket:     '',
  messagingSenderId: '',
  appId:             '',
  measurementId:     '',
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
