// components/TopBar.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type TopBarProps = {
  title: string;
  showBack?: boolean;
};

export default function TopBar({ title, showBack = true }: TopBarProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {showBack && (
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={{ width: 24 }} /> {/* Empty space to balance back icon */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#C85383',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
});
