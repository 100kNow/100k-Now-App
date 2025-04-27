# 100k Now 🚀

**100k Now** is an **open-source** mobile app (React Native + Expo) whose mission is to help **100 000 Black women detect and defeat breast cancer** through early self-checks, expert consultations, appointment tracking, and a supportive community.

<p align="center">
  <!-- optional badge examples -->
  <img alt="Expo" src="https://img.shields.io/badge/Expo-%5E49.0-000?logo=expo&logoColor=white" />
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-Cloud%20Firestore%20%7C%20Auth%20%7C%20Storage-FFCA28?logo=firebase&logoColor=white" />
  <img alt="Open Source" src="https://img.shields.io/badge/open%20source-MIT-green" />
</p>

---

## ✨ Features

| Module | What it does |
|--------|--------------|
| **Self-Check Guide** | Step-by-step breast self-examination with instant risk assessment. |
| **Expert Booking**   | Book oncology specialists, store bookings in Firestore, status tracking. |
| **Appointments**     | See upcoming & past appointments – real-time Firestore sync. |
| **Stories / Feedback** | Users share stories or feedback (optional public flag). |
| **Notifications**    | Firestore-driven in-app notification feed. |
| **Secure Auth**      | Email + password with Firebase Auth & AsyncStorage persistence. |

> All data is synced with Firebase (Auth | Cloud Firestore | Storage).

---

## 🛠 Tech Stack

| Layer | Tools |
|-------|-------|
| **Frontend** | React Native (Expo SDK 49), React Navigation v6, Expo Router |
| **Backend-as-a-Service** | Firebase (Auth · Firestore · Storage) |
| **State & Hooks** | React hooks, realtime Firestore listeners |
| **Styling** | Plain StyleSheet, Expo SafeArea & LinearGradient |
| **Misc.** | EmailJS / SendGrid (pluggable), expo-mail-composer |

---

## 🔧 Local Setup

```bash
# 1) clone
git clone https://github.com/<you>/100k-now.git
cd 100k-now

# 2) install (Yarn or npm – pick one)
yarn        # or: npm i

# 3) copy env template & add your Firebase keys
cp .env.example .env

# 4) start the Expo dev server
npx expo start
