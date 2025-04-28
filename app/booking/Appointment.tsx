// app/booking/Appointment.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, FlatList,
} from 'react-native';
import { Ionicons }      from '@expo/vector-icons';
import TopBar            from '@/components/TopBar';
import { SafeAreaView }  from 'react-native-safe-area-context';

import {
  collection, query, where, orderBy, onSnapshot, Timestamp,
} from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';

/* ─── types ────────────────────────────────────────────────────── */
type Booking = {
  id         : string;
  expert     : string;
  date       : Timestamp;                           // confirmed slot
  submittedAt: Timestamp;                           // when user asked
  status     : 'pending' | 'confirmed' | 'done'
             | 'cancelled' | string;                // fallback for any value
};

/* ─── component ───────────────────────────────────────────────── */
export default function AppointmentList() {
  const [items,   setItems]   = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  /* realtime listener */
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, 'acceptedBookings'),       // ← changed collection
      where('uid', '==', uid),
      orderBy('submittedAt', 'desc'),           // needs composite index once
    );

    const unsub = onSnapshot(
      q,
      snap => {
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking)));
        setLoading(false);
      },
      err  => {
        // If the composite index is still building you’ll land here
        console.warn(err.message);
        setLoading(false);
      },
    );

    return unsub;
  }, []);

  /* ─── UI ─── */
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 0, backgroundColor: '#C85383' }} />
      <TopBar title="My Appointments" />

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#C85383" />
        </View>
      )}

      {!loading && items.length === 0 && (
        <View style={styles.center}>
          <Ionicons name="calendar-clear" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No appointments yet.</Text>
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => {
          const when = new Date(item.date.seconds * 1000).toLocaleString();
          const chipStyle =
            item.status === 'confirmed' ? { backgroundColor: '#4CAF50' } :
            item.status === 'done'      ? { backgroundColor: '#2196F3' } :
            item.status === 'cancelled' ? { backgroundColor: '#F44336' } :
            {};

          return (
            <View style={styles.row}>
              <Ionicons name="calendar" size={22} color="#C85383" />

              <View style={styles.rowText}>
                <Text style={styles.when}>{when}</Text>
                <Text style={styles.expert}>{item.expert}</Text>
              </View>

              <View style={[styles.statusChip, chipStyle]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

/* ─── styles ───────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  container : { flex: 1, backgroundColor: '#F9F9F9' },
  center    : { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText : { marginTop: 10, fontSize: 16, color: '#888' },

  row: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 14,
    backgroundColor: '#fff', padding: 14, borderRadius: 12,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  rowText: { flex: 1, marginHorizontal: 12 },
  when   : { fontSize: 15, color: '#333' },
  expert : { fontSize: 13, color: '#666' },

  statusChip: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
    backgroundColor: '#FFA000',
  },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
