// WorkoutBottomSheet.tsx
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { PanGestureHandler, GestureHandlerRootView, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo Icons
import ExerciseCard from './ExerciseCard'; // Import the ExerciseCard component

type MuscleGroup = 'Chest' | 'Arms' | 'Legs' | 'Back' | 'Shoulders' | 'Cardio';

interface WorkoutBottomSheetProps {
  isSheetOpen: boolean;
  onClose: () => void;
  onAddWorkout: (exercise: string) => void;
  onRemoveWorkout: (exercise: string) => void; 
}

const { height: screenHeight } = Dimensions.get('window');

const WorkoutBottomSheet: React.FC<WorkoutBottomSheetProps> = ({ isSheetOpen, onClose, onAddWorkout,  onRemoveWorkout }) => {
  const [selectedOption, setSelectedOption] = useState<'Exercises' | 'Programs'>('Exercises');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]); // State to track multiple selected exercises
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [0.25 * screenHeight, 0.5 * screenHeight, screenHeight], [screenHeight]);

  type IoniconsName = 'fitness-outline' | 'body-outline' | 'walk-outline' | 'barbell-outline' | 'man-outline' | 'heart-outline';

  const muscleGroups: { name: MuscleGroup, icon: IoniconsName }[] = [
    { name: 'Chest', icon: 'fitness-outline' },
    { name: 'Arms', icon: 'body-outline' },
    { name: 'Legs', icon: 'walk-outline' },
    { name: 'Back', icon: 'barbell-outline' },
    { name: 'Shoulders', icon: 'man-outline' },
    { name: 'Cardio', icon: 'heart-outline' },
  ];
  
  const programs = ['Program 1', 'Program 2', 'Program 3'];
  const exercises = {
    Chest: [
      'Bench Press',
      'Chest Fly',
      'Incline Bench Press',
      'Decline Bench Press',
      'Cable Crossover',
      'Push-Up',
      'Dumbbell Pullover',
      'Pec Deck Machine',
      'Incline Dumbbell Fly',
      'Dips for Chest',
    ],
    Arms: [
      'Bicep Curl',
      'Tricep Extension',
      'Hammer Curl',
      'Skull Crusher',
      'Preacher Curl',
      'Tricep Dips',
      'Concentration Curl',
      'Tricep Kickback',
      'Cable Curl',
      'Overhead Tricep Extension',
    ],
    Legs: [
      'Squat',
      'Lunge',
      'Leg Press',
      'Leg Extension',
      'Leg Curl',
      'Calf Raise',
      'Deadlift',
      'Step-Up',
      'Glute Bridge',
      'Bulgarian Split Squat',
    ],
    Back: [
      'Pull Up',
      'Row',
      'Deadlift',
      'Lat Pulldown',
      'Back Extension',
      'T-Bar Row',
      'Seated Cable Row',
      'Bent Over Row',
      'Single-Arm Dumbbell Row',
      'Chin-Up',
    ],
    Shoulders: [
      'Shoulder Press',
      'Lateral Raise',
      'Front Raise',
      'Reverse Fly',
      'Upright Row',
      'Arnold Press',
      'Shrugs',
      'Face Pull',
      'Single-Arm Dumbbell Press',
      'Cable Lateral Raise',
    ],
    Cardio: [
      'Running',
      'Cycling',
      'Jump Rope',
      'Rowing',
      'Swimming',
      'Boxing',
      'Burpees',
      'Stair Climber',
      'High Knees',
      'Mountain Climbers',
    ],
  };

  const handleSelectOption = (option: 'Exercises' | 'Programs') => {
    setSelectedOption(option);
    setSelectedMuscle(null); 
  };

  const handleSelectMuscle = (muscle: MuscleGroup) => {
    setSelectedMuscle(muscle);
  };

  const handleSwipeBack = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationX > 50) {
        setSelectedMuscle(null);
      }
    }
  };

  const toggleExerciseSelect = (exercise: string) => {
    if (selectedExercises.includes(exercise)) {
      setSelectedExercises(selectedExercises.filter((item) => item !== exercise)); // Unselect exercise
    } else {
      setSelectedExercises([...selectedExercises, exercise]); // Select exercise
      onAddWorkout(exercise); // Call the onAddWorkout callback
    }
  };
  const handleRemoveExercise = (exercise: string) => {
    setSelectedExercises(selectedExercises.filter((item) => item !== exercise));
    onRemoveWorkout(exercise)
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isSheetOpen ? 2 : -1}
      snapPoints={snapPoints}
      onClose={onClose}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.bottomSheetContent}>
        <View style={styles.topSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#1C1C1E" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <View style={styles.optionContainer}>
            <TouchableOpacity 
              onPress={() => handleSelectOption('Exercises')} 
              style={[
                styles.optionButton, 
                selectedOption === 'Exercises' && styles.selectedOption
              ]}
            >
              <Text style={[styles.optionText, { color: selectedOption === 'Exercises' ? '#FFFFFF' : '#1C1C1E' }]}>Exercises</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleSelectOption('Programs')} 
              style={[
                styles.optionButton, 
                selectedOption === 'Programs' && styles.selectedOption
              ]}
            >
              <Text style={[styles.optionText, { color: selectedOption === 'Programs' ? '#FFFFFF' : '#1C1C1E' }]}>Programs</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addExerciseButton}>
            <Ionicons 
              name="add-circle-outline" 
              size={20} 
              color="#000" 
            />
            <Text style={styles.addExerciseText}>
              {selectedOption === 'Exercises' ? 'Add New Exercise' : 'Add New Program'}
            </Text>
          </TouchableOpacity>
        </View>

        {selectedOption === 'Exercises' && !selectedMuscle && (
          <View style={styles.muscleGroupsContainer}>
            <FlatList
              data={muscleGroups}
              keyExtractor={(item) => item.name}
              numColumns={2}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectMuscle(item.name)} style={styles.muscleCard}>
                  <Ionicons name={item.icon} size={30} color="#1C1C1E" />
                  <Text style={styles.muscleText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {selectedOption === 'Exercises' && selectedMuscle && (
          <PanGestureHandler onHandlerStateChange={handleSwipeBack}>
            <FlatList
              data={exercises[selectedMuscle as keyof typeof exercises]}
              keyExtractor={(item) => item}
              numColumns={2}
              renderItem={({ item }) => (
                <ExerciseCard
                  exercise={item}
                  isSelected={selectedExercises.includes(item)}
                  onSelect={() => toggleExerciseSelect(item)}
                  onUnselect={() => handleRemoveExercise(item)}
                />
              )}
              columnWrapperStyle={{ justifyContent: 'space-between' }} // Adjust spacing between columns
              showsVerticalScrollIndicator={false}
            />
          </PanGestureHandler>
        )}

        {selectedOption === 'Programs' && (
          <View style={styles.programContainer}>
            <TouchableOpacity style={styles.addProgramButton}>
              <Text style={styles.addProgramText}>Create Your Own Program</Text>
            </TouchableOpacity>
            <FlatList
              data={programs}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.programButton}>
                  <Text style={styles.programText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  handleIndicator: {
    backgroundColor: '#ccc',
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 10,
  },
  topSection: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#1C1C1E',
    paddingVertical: 8,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedOption: {
    backgroundColor: '#000',
    borderColor: '#000',
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addExerciseText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  muscleGroupsContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  muscleCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 5,
    borderRadius: 15,
    backgroundColor: '#F9F9F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  muscleText: {
    marginTop: 10,
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '600',
  },
  programContainer: {
    flex: 1,
  },
  addProgramButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    marginBottom: 10,
  },
  addProgramText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  programButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    marginBottom: 10,
  },
  programText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
});

export default WorkoutBottomSheet;
