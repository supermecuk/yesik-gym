import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Easing } from 'react-native';

const getWeekDates = (startDate: Date) => {
  const weekDates = [];
  const current = new Date(startDate);

  for (let i = 0; i < 7; i++) {
    weekDates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return weekDates;
};

const getMonthDates = (year: number, month: number) => {
  const dates = [];
  const firstDay = new Date(year, month, 1);
  const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Adjusting for Monday as the first day
  const previousMonth = new Date(year, month, 0).getDate(); // Last day of previous month

  // Fill in the dates from the previous month
  for (let i = firstDayOfWeek; i > 0; i--) {
    dates.push(new Date(year, month - 1, previousMonth - i + 1));
  }

  // Fill in the dates for the current month
  while (firstDay.getMonth() === month) {
    dates.push(new Date(firstDay));
    firstDay.setDate(firstDay.getDate() + 1);
  }

  // Fill the remaining slots with the next month dates
  let nextMonthDate = 1;
  while (dates.length % 7 !== 0) {
    dates.push(new Date(year, month + 1, nextMonthDate++));
  }

  return dates;
};

export default function Calendar ({ onDateChange }: { onDateChange: (date: Date) => void }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(getInitialWeekStart(selectedDate));
  const [isExpanded, setIsExpanded] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekDates = getWeekDates(weekStart);
  const monthDates = getMonthDates(selectedDate.getFullYear(), selectedDate.getMonth());

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  const handleSwipe = ({ nativeEvent }: any) => {
    const { translationX, translationY, state } = nativeEvent;

    if (state === State.END) {
      if (translationX < -50) {
        isExpanded ? animateMonth('next') : animateWeek('right'); // Swipe left
      } else if (translationX > 50) {
        isExpanded ? animateMonth('prev') : animateWeek('left'); // Swipe right
      } else if (translationY > 50 && !isExpanded) {
        expandCalendar(); // Swipe down to expand to full month view
      } else if (translationY < -50 && isExpanded) {
        collapseCalendar(); // Swipe up to collapse back to week view
      }
    }
  };

  const animateWeek = (direction: 'left' | 'right') => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: direction === 'right' ? -100 : 100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      moveWeek(direction);
      translateX.setValue(direction === 'right' ? 100 : -100);
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const moveWeek = (direction: 'left' | 'right') => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(weekStart.getDate() + (direction === 'right' ? 7 : -7));
    setWeekStart(newWeekStart);
  };

  const animateMonth = (direction: 'next' | 'prev') => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: direction === 'next' ? -100 : 100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      moveMonth(direction);
      translateX.setValue(direction === 'next' ? 100 : -100);
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const moveMonth = (direction: 'next' | 'prev') => {
    const newMonthDate = new Date(selectedDate);
    newMonthDate.setMonth(newMonthDate.getMonth() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newMonthDate);
  };

  const expandCalendar = () => {
    setIsExpanded(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const collapseCalendar = () => {
    setIsExpanded(false);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleDragIndicatorPress = () => {
    if (isExpanded) {
      collapseCalendar();
    } else {
      expandCalendar();
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}
        </Text>
        <TouchableOpacity onPress={() => { /* Settings action */ }}>
          <Ionicons name="settings-outline" size={24} color="#1C1C1E" />
        </TouchableOpacity>
      </View>

      <View style={styles.daysRow}>
        {daysOfWeek.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text style={styles.day}>{day}</Text>
          </View>
        ))}
      </View>

      <PanGestureHandler
        onGestureEvent={handleSwipe}
        onHandlerStateChange={handleSwipe}
        activeOffsetX={[-10, 10]}
        failOffsetY={[-10, 10]}
      >
        <Animated.View
          style={[
            styles.weekContainer,
            {
              transform: [{ translateX }],
              opacity: opacity,
              flexWrap: isExpanded ? 'wrap' : 'nowrap',
              justifyContent: isExpanded ? 'flex-start' : 'space-between',
            },
          ]}
        >
          {!isExpanded
            ? weekDates.map((date, index) => (
                <View key={index} style={styles.dateContainer}>
                  <TouchableOpacity onPress={() => handleDateChange(date)}>
                    <View
                      style={[
                        styles.dateCircle,
                        date.toDateString() === selectedDate.toDateString() && styles.selectedDate,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dateText,
                          date.toDateString() === selectedDate.toDateString() && styles.selectedDateText,
                        ]}
                      >
                        {date.getDate()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            : monthDates.map((date, index) => (
                <View
                  key={index}
                  style={[
                    styles.dateContainer,
                    {
                      width: `${100 / 7}%`,
                      marginHorizontal: 0,
                    },
                  ]}
                >
                  <TouchableOpacity onPress={() => handleDateChange(date)}>
                    <View
                      style={[
                        styles.dateCircle,
                        date.toDateString() === selectedDate.toDateString() && styles.selectedDate,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dateText,
                          date.toDateString() === selectedDate.toDateString() && styles.selectedDateText,
                        ]}
                      >
                        {date.getDate()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
        </Animated.View>
      </PanGestureHandler>

      <PanGestureHandler
        onGestureEvent={handleSwipe}
        onHandlerStateChange={handleSwipe}
        activeOffsetY={[-10, 10]}
        failOffsetX={[-10, 10]}
      >
        <Animated.View style={{ paddingVertical: 10, width: '100%', alignItems: 'center' }}>
          <TouchableOpacity onPress={handleDragIndicatorPress} style={styles.dragHandle}>
            <View style={styles.dragLine} />
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
}

const getInitialWeekStart = (date: Date) => {
  const initialWeekStart = new Date(date);
  initialWeekStart.setDate(initialWeekStart.getDate() - (initialWeekStart.getDay() === 0 ? 6 : initialWeekStart.getDay() - 1));
  return initialWeekStart;
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderRadius: 15
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  dayContainer: {
    alignItems: 'center',
    width: 40,
  },
  day: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    textAlign: 'center',
  },
  weekContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    alignItems: 'center',
    width: 40,
  },
  dateCircle: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 15,
  },
  dateText: {
    fontSize: 16,
    color: '#1C1C1E',
    textAlign: 'center',
  },
  selectedDate: {
    backgroundColor: '#2C2C2C',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  dragHandle: {
    alignItems: 'center',
    marginTop: 5,
  },
  dragLine: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D1D6',
    borderRadius: 2,
  },
});
