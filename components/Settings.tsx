import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../app/config/firebase'; 
import { getFirestore, collection, doc, setDoc, getDoc, addDoc } from 'firebase/firestore';
// Import Firebase auth
const firestore = getFirestore(); 
// Define Settings Component
export default function Settings({
  workouts,
  saveWorkoutsToFirebase,
  navigation
}: {
  workouts: Record<string, { name: string; sets: { reps: string; weight: string }[] }[]>;
  saveWorkoutsToFirebase: (workouts: Record<string, { name: string; sets: { reps: string; weight: string }[] }[]>) => void;
  navigation: any;
}) {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  

  // Function to log out user
  const handleLogout = async () => {
    try {
      // Save workouts before logging out
       saveWorkoutsToFirebase(workouts);

      // Sign out from Firebase Auth
      await signOut(auth);
      console.log('User logged out');

      // Navigate to SignInScreen
      navigation.navigate('SignInScreen');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Function to open settings modal
  const handleOpenSettings = () => {
    setIsSettingsVisible(true);
  };

  // Function to close settings modal
  const handleCloseSettings = () => {
    setIsSettingsVisible(false);
  };

  return (
    <View>
      {/* Settings Button */}
      <TouchableOpacity style={styles.settingsButton} onPress={handleOpenSettings}>
        <Ionicons name="settings-outline" size={24} color="#000" />
      </TouchableOpacity>

      {/* Settings Modal */}
      <Modal visible={isSettingsVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Settings</Text>

            {/* Logout Button */}
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity onPress={handleCloseSettings} style={styles.closeModalButton}>
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsButton: {

  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
  },
  logoutText: {
    marginLeft: 10,
    color: '#FF3B30',
    fontWeight: '600',
  },
  closeModalButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  closeModalText: {
    color: '#fff',
    fontWeight: '600',
  },
});
