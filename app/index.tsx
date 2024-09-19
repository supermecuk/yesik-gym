// app/index.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './config/firebase'; // Adjust the path to your firebase.ts file
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import MainTab from './MainTab';
import { User } from 'firebase/auth'; // Import Firebase User type
import { ActivityIndicator, View } from 'react-native'; // Import loading spinner

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null); // Specify the type of user state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authenticatedUser) => {
      setUser(authenticatedUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       
        <ActivityIndicator size="large" color="#0000ff" /> 
      
      </View>
    );
  }

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <Stack.Screen name="MainTab" component={MainTab} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
