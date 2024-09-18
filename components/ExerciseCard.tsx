// ExerciseCard.tsx
import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Easing } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface ExerciseCardProps {
  exercise: string;
  isSelected: boolean;
  onSelect: () => void;
  onUnselect: () => void; // Add this new prop
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, isSelected, onSelect, onUnselect }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  const handleInfoPress = () => {
    setModalVisible(true);
    Animated.timing(scale, {
      toValue: 1.2,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleCloseModal = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.cardContainer,
          isSelected && styles.selectedCardContainer,
        ]}
        onPress={() => (isSelected ? onUnselect() : onSelect())} // Toggle selection
      >
        <Text style={[styles.cardText, { color: isSelected ? '#FFFFFF' : '#1C1C1E' }]}>{exercise}</Text>
        <TouchableOpacity style={[styles.infoIcon]} onPress={handleInfoPress}>
          <Ionicons name="information-circle-outline" size={24} color={isSelected ? '#FFFFFF' : '#1C1C1E'} />
        </TouchableOpacity>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContent, { transform: [{ scale }] }]}>
            <Text style={styles.modalTitle}>{exercise}</Text>
            <Text style={styles.modalDescription}>
              {/* Add detailed description of the exercise */}
              This is a detailed description of {exercise}. Here you can provide more information about the exercise,
              including the technique, target muscles, and tips.
            </Text>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: screenWidth / 2 - 40,
    paddingVertical: 40,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 5,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCardContainer: {
    backgroundColor: '#000', 
    
  },
  cardText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  infoIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: screenWidth - 40,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1C1C1E',
  },
  modalDescription: {
    fontSize: 16,
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ExerciseCard;
