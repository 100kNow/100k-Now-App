import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons }        from '@expo/vector-icons';
import { SafeAreaView }    from 'react-native-safe-area-context';
import TopBar              from '@/components/TopBar';

import {
  collection, query, where, orderBy, onSnapshot, Timestamp,
} from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';

/* ─── types ────────────────────────────────────────────────────── */
type Notif = {
  id        : string;
  title     : string;
  body      : string;
  createdAt : Timestamp;
  read?     : boolean;
};

/* ─── component ───────────────────────────────────────────────── */
export default function NotificationsModal() {
  const [items,   setItems]   = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  /* realtime listener */
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, 'notifications'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc'),          // requires composite index once
    );

    const unsub = onSnapshot(
      q,
      snap => {
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as Notif)));
        setLoading(false);
      },
      err  => {
        console.warn(err.message);
        setLoading(false);
      },
    );

    return unsub;
  }, []);

  /* individual row */
  const renderItem = ({ item }: { item: Notif }) => (
    <View style={[
      styles.card,
      item.read && { opacity: 0.55 },
    ]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.body}</Text>

      <Text style={styles.time}>
        {new Date(item.createdAt.seconds * 1000).toLocaleString()}
      </Text>
    </View>
  );

  /* ─── UI ─── */
  return (
    <View style={styles.modal}>
     
      <TopBar title="Notifications" />

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#C85383" />
        </View>
      )}

      {!loading && items.length === 0 && (
        <View style={styles.center}>
          <Ionicons name="notifications-off" size={64} color="#ccc" />
          <Text style={{ marginTop: 10, fontSize: 16, color: '#888' }}>
            No notifications yet
          </Text>
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

/* ─── styles ───────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  modal: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  card: {
    backgroundColor: '#FADEEA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    color: '#C85383',
    marginBottom: 4,
    fontSize: 16,
  },
  text: { fontSize: 14, color: '#333' },
  time: { marginTop: 8, fontSize: 12, color: '#666', textAlign: 'right' },
});
