import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Linking } from 'react-native';

export default function CommunityPopup() {
  const [modalVisible, setModalVisible] = useState(false);

  const openLink = (url: string) => {
    Linking.openURL(url);
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.cardText}>
          Join our community and connect with women who understand your journey.
        </Text>
        <View style={styles.communityContainer}>
          <TouchableOpacity style={styles.communityButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.communityButtonText}>Join Us</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose a Community</Text>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => openLink('https://chat.whatsapp.com/your-group')}>
              <Text style={styles.linkText}>Join WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => openLink('https://discord.gg/your-discord')}>
              <Text style={styles.linkText}>Join Discord</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => openLink('https://facebook.com/groups/your-group')}>
              <Text style={styles.linkText}>Join Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  communityContainer: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  communityButton: {
    backgroundColor: '#C85383',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  communityButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#C85383',
  },
  linkButton: {
    backgroundColor: '#FAE0EC',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  linkText: {
    color: '#C85383',
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelText: {
    color: '#999',
    fontSize: 14,
  },
});
