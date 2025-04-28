import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '@/components/TopBar';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';

/* ──────────────── types ──────────────── */
type Booking = {
  id     : string;
  doctor : string;
  date   : Timestamp;     // appointment date-time stored in Firestore
  status : 'Completed' | 'Missed';
};

/* ──────────────── empty state ──────────────── */
const EmptyBookings = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="calendar-clear" size={60} color="#ccc" />
    <Text style={styles.emptyText}>No booking history found</Text>
  </View>
);

/* ──────────────── component ──────────────── */
export default function BookingHistory() {
  const [history, setHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  /* realtime feed */
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;                                     // user not logged in

    const q = query(
      collection(db, 'expertBookings'),
      where('uid', '==', uid),                            // ← only this user
      orderBy('date', 'desc'),                            // newest first
    );

    const unsub = onSnapshot(q, snap => {
      setHistory(
        snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking)),
      );
      setLoading(false);
    });

    return unsub;
  }, []);

  /* render one card */
  const renderItem = ({ item }: { item: Booking }) => {
    const ts     = item.date as unknown as Timestamp;
    const jsDate = new Date(ts.seconds * 1000);
    const pretty = format(jsDate, 'MMM d, yyyy · hh:mm a');

    return (
      <View style={styles.card}>
        <Text style={styles.doctor}>{item.doctor}</Text>
        <Text style={styles.info}>{pretty}</Text>
        <Text
          style={[
            styles.status,
            item.status === 'Missed' ? styles.missed : styles.completed,
          ]}>
          {item.status}
        </Text>
      </View>
    );
  };

  /* UI */
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: '#C85383' }} edges={['top']}>
        <TopBar title="Booking History" />
      </SafeAreaView>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#C85383" />
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={history.length ? styles.listContent : { flex: 1 }}
          ListEmptyComponent={<EmptyBookings />}
        />
      )}
    </View>
  );
}

/* ──────────────── styles ──────────────── */
const styles = StyleSheet.create({
  container   : { flex: 1, backgroundColor: '#FEEAF3' },
  listContent : { padding: 16 },
  loader      : { flex: 1, justifyContent: 'center', alignItems: 'center' },

  card: {
    backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4, elevation: 3,
  },
  doctor : { fontSize: 16, fontWeight: 'bold', color: '#C85383' },
  info   : { fontSize: 14, color: '#555', marginTop: 4 },
  status : { marginTop: 8, fontWeight: 'bold', fontSize: 13, textAlign: 'right' },
  completed: { color: '#4CAF50' },
  missed   : { color: '#F44336' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText    : { fontSize: 16, color: '#888', marginTop: 8 },
});
