import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, FlatList, Dimensions } from 'react-native';
import { GestureHandlerRootView , PanGestureHandler, State  } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import WorkoutBottomSheet from '@/components/WorkoutBottomSheet';
import Calendar from '@/components/Calendar';
import { Animated } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function MainTab() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [workouts, setWorkouts] = useState<Record<string, string[]>>({});
  const [expandedItemIndex, setExpandedItemIndex] = useState<number | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sets, setSets] = useState<{ reps: string; weight: string }[]>([{ reps: '', weight: '' }]);
  const [isTimerModalVisible, setIsTimerModalVisible] = useState(false);
  const [timer, setTimer] = useState({ minutes: '00', seconds: '00' });

   // Create refs for each item

  const translateXRefs = useRef<{ [key: string]: Animated.Value }>({});

  const handleAddWorkout = (exercise: string) => {
    const currentDate = selectedDate.toDateString();
    const updatedWorkouts = [
      ...(workouts[currentDate] || []),
      exercise || `Workout ${workouts[currentDate]?.length + 1}`,
    ];
    setWorkouts({ ...workouts, [currentDate]: updatedWorkouts });
    setIsSheetOpen(false);
  };
  const handleRemoveWorkout = (exercise: string) => {
    const currentDate = selectedDate.toDateString();
    const updatedWorkouts = workouts[currentDate]?.filter((work) => work !== exercise) || [];
    setWorkouts({ ...workouts, [currentDate]: updatedWorkouts });
  };
  const handleOpenBottomSheet = () => {
    setIsSheetOpen(true);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
  };

  const handleExpandItem = (index: number) => {
    // Toggle expansion without affecting the workout list
    setExpandedItemIndex(index === expandedItemIndex ? null : index);
  };

  const handleAddSet = () => {
    setSets([...sets, { reps: '', weight: '' }]);
  };

  const handleTimerClick = () => {
    setIsTimerModalVisible(true);
  };

  const handleTimerChange = (field: 'minutes' | 'seconds', value: string) => {
    setTimer({ ...timer, [field]: value });
  };
  const renderWorkoutItem = ({ item, index }: { item: string, index: number }) => {
    const isExpanded = expandedItemIndex === index;

    // Create a new ref for each item if it doesn't exist
    if (!translateXRefs.current[item]) {
      translateXRefs.current[item] = new Animated.Value(0);
    }

    const handleSwipeGesture = Animated.event(
      [{ nativeEvent: { translationX: translateXRefs.current[item] } }],
      { useNativeDriver: true }
    );

    const handleSwipeEnd = ({ nativeEvent }: any) => {
      if (nativeEvent.translationX < -150) {
        Animated.timing(translateXRefs.current[item], {
          toValue: -screenWidth,
          duration: 200,
          useNativeDriver: true,
        }).start(() => handleRemoveWorkout(item));
      } else {
        Animated.spring(translateXRefs.current[item], {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    };

    return (
      <PanGestureHandler
        onGestureEvent={handleSwipeGesture}
        onHandlerStateChange={handleSwipeEnd}
        activeOffsetX={[-10, 10]}
      >
        <Animated.View style={[ { transform: [{ translateX: translateXRefs.current[item] }] }]}>
          <TouchableOpacity
            style={[styles.workoutItemContent, isExpanded && styles.expandedWorkoutItem]}
            onPress={() => handleExpandItem(index)}
          >
            <Ionicons name="barbell-outline" size={24} color="#000" />
            <Text style={styles.workoutText}>{item}</Text>
            {isExpanded && (
              <TouchableOpacity style={styles.addSetIcon} onPress={handleAddSet}>
                <Ionicons name="add-circle-outline" size={24} color="#1C1C1E" />
              </TouchableOpacity>
            )}
            {isExpanded && (
              <View style={styles.expandedContent}>
                {sets.map((set, i) => (
                  <View key={i} style={styles.setRow}>
                  
                    <View style={styles.inputsContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Reps"
                        value={set.reps}
                        keyboardType="numeric"
                        onChangeText={(text) => {
                          const newSets = [...sets];
                          newSets[i].reps = text;
                          setSets(newSets);
                        }}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Weight (kg)"
                        value={set.weight}
                        keyboardType="numeric"
                        onChangeText={(text) => {
                          const newSets = [...sets];
                          newSets[i].weight = text;
                          setSets(newSets);
                        }}
                      />
                      <TouchableOpacity style={styles.timerButton} onPress={handleTimerClick}>
                        <Ionicons name="timer-outline" size={20} color="#1C1C1E" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    );
  };

  return (
    <> 
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Calendar onDateChange={(date) => setSelectedDate(date)} />
        <View style={styles.container}>
          {/* Main Workout Area */}
          <View
            style={styles.workoutContainer}
            pointerEvents={isSheetOpen ? 'none' : 'auto'}
          >
            {workouts[selectedDate.toDateString()]?.length > 0 ? (
              <FlatList
                data={workouts[selectedDate.toDateString()]}
                renderItem={renderWorkoutItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.workoutList}
              />
            ) : (
              <Text style={styles.workoutText}>No workouts recorded.</Text>
            )}
          </View>

          

          {/* Add Workout Button */}
          <TouchableOpacity style={styles.addButton} onPress={handleOpenBottomSheet}>
            <Text style={styles.addButtonText}>Add Workout</Text>
          </TouchableOpacity>

            
 {/* Timer Modal */}
 <Modal visible={isTimerModalVisible} transparent animationType="slide">
            <View style={styles.timerModalContainer}>
              <View style={styles.timerModalContent}>
                <TextInput
                  style={styles.timerInput}
                  placeholder="00"
                  value={timer.minutes}
                  keyboardType="numeric"
                  onChangeText={(text) => handleTimerChange('minutes', text)}
                />
                <Text>:</Text>
                <TextInput
                  style={styles.timerInput}
                  placeholder="00"
                  value={timer.seconds}
                  keyboardType="numeric"
                  onChangeText={(text) => handleTimerChange('seconds', text)}
                />
                <TouchableOpacity
                  onPress={() => setIsTimerModalVisible(false)}
                  style={styles.closeModalButton}
                >
                  <Text style={styles.closeModalText}>Set Timer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
            

          {/* Settings Modal */}
          <Modal visible={isSettingsVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Settings</Text>
                <Text>Settings will go here...</Text>
                <TouchableOpacity onPress={() => setIsSettingsVisible(false)} style={styles.closeModalButton}>
                  <Text style={styles.closeModalText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Bottom Sheet for Adding Exercise or Program */}
          <WorkoutBottomSheet
            isSheetOpen={isSheetOpen}
            onClose={handleSheetClose}
            onAddWorkout={handleAddWorkout}
            onRemoveWorkout={handleRemoveWorkout}
          />
        </View>
        
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  workoutList: {
    paddingBottom: 20,
  },
  workoutItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginVertical: 4,
 
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addSetIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  expandedWorkoutItem: {
    width: screenWidth - 40,
    flexDirection: 'column',
    padding: 15,
    position: 'relative', },

  workoutContainer: {
    flex: 1,
    paddingTop: 10,
  },
  workoutText: {
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 10,
  },
  expandedContent: {
    marginTop: 10,
    width: '100%',
  
  },

  setRow: {
    marginBottom: 10, // Space between rows
  },
  setLabel: {
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 5, // Add space between the label and input fields
  },
  inputsContainer: {
    flexDirection: 'row',
    
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#F8F8F8',
  },
  timerButton: {
    padding: 10,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  setsContainer: {
    flexDirection: 'column', 
    width: '100%', 
    
  },
  hiddenItem: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', 
    height: '100%',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addSetText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#1C1C1E',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#1C1C1E',
  },
  timerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  timerModalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  timerInput: {
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginHorizontal: 5,
    width: 40,
    textAlign: 'center',
  },
  closeModalButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
  },
  closeModalText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});


