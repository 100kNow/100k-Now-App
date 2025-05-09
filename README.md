<!-- README.md -->
# 100k Now 🚀

**100k Now** is an **open-source** mobile app (React Native + Expo) on a mission to help **100 000 Black women detect and defeat breast cancer** through early self-checks, expert consultations, appointment tracking, and a supportive community.

<p align="center">
  <img alt="Expo"  src="https://img.shields.io/badge/Expo-%5E49.0-000?logo=expo&logoColor=white" />
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-Firestore %7C Auth %7C Storage-FFCA28?logo=firebase&logoColor=white" />
  <img alt="Open Source" src="https://img.shields.io/badge/open source-MIT-green" />
</p>

---

## ✨ Features

| Module | What it does |
|--------|--------------|
| **Self-Check Guide** | Step-by-step breast self-exam with instant risk assessment. |
| **AI&nbsp;Scanning & Sensor Tech** | Pair low-cost BLE sensors or use the phone camera for on-device lump/heat mapping (prototype). |
| **Expert Booking** | Book oncology specialists; requests stored in Firestore with real-time status. |
| **Appointments** | View upcoming & past appointments via realtime Firestore listeners. |
| **Stories / Feedback** | Users share stories or feedback (optional public flag). |
| **Notifications** | Firestore-driven in-app notification feed. |
| **Secure Auth** | Email + password using Firebase Auth & AsyncStorage persistence. |

> All data is synced with **Firebase** (Auth · Cloud Firestore · Storage).

---

## 🛠 Tech Stack

| Layer | Tools |
|-------|-------|
| **Frontend** | React Native (Expo SDK 49), React Navigation v6, Expo Router |
| **Backend-as-a-Service** | Firebase (Auth · Firestore · Storage) |
| **State & Hooks** | React hooks, realtime Firestore snapshots |
| **Styling** | Plain StyleSheet, Expo SafeArea & LinearGradient |
| **Misc.** | SendGrid / EmailJS (pluggable), expo-mail-composer |

---

## 🔬 AI Scanning & Sensor Technology 🚧

We’re actively building hardware-assisted detection to push early diagnosis even further.

| Capability | How it works | Status |
|------------|--------------|--------|
| **Wireless Sensor Pairing** | ⚡️ Connect the app to affordable BLE wearables that read surface temperature, elasticity & micro-ultrasound. | *In progress* |
| **Realtime Camera Scan** | 📲 Phone camera + on-device ML highlights potential lumps/skin changes in AR. | *Prototype complete* |
| **Multi-Modal Fusion** | 🧠 Fuses sensor data, camera frames & self-check answers to compute a personalised risk score— all on device. | *Research* |
| **Encrypted Cloud Sync** | 🔐 Optional, E2E-encrypted upload of anonymised readings for doctor review. | *Planned* |
| **Regulatory Pathway** | 🏥 Built around IEC 62304 & ISO 14971 for eventual Class II clearance. | *In prep* |

> **Why this matters:** subtle heat or stiffness changes can appear **months** before a lump is palpable. Affordable sensors + edge AI = hospital-grade insight, anywhere.

### 🧪 Try the Scan Prototype (developers)

```bash
# opt-in to the experimental flag
echo 'EXPO_PUBLIC_ENABLE_AI_SCAN=true' >> .env

# rebuild & run on a physical device
npx expo start
