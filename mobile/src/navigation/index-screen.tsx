import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './route-types';
import HomeScreen from '../screens/home/home-screen';
import RegisterScreen from '../screens/auth/register-screen';
import LoginScreen from '../screens/auth/login-screen';
import DashboardScreen from '../screens/protected/dashboard/dashboard';
import ChatScreen from '../screens/protected/chat/chat-screen';
import ProfileScreen from '../screens/protected/profile/profile-screen';
import { useSelector } from 'react-redux';
import { UserRootState } from '../redux/user/reducer';

const AuthStack = createNativeStackNavigator<RootStackParamList>();
const Navigation = () => {
  const user = useSelector((state: UserRootState) => state.user);

  return (
    <AuthStack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      {user.isLoggedIn ? (
        <AuthStack.Group>
          <AuthStack.Screen name="Dashboard" component={DashboardScreen} />
          <AuthStack.Screen name="ChatScreen" component={ChatScreen} />
          <AuthStack.Screen name="ProfileScreen" component={ProfileScreen} />
        </AuthStack.Group>
      ) : (
        <AuthStack.Group>
          <AuthStack.Screen name="HomeScreen" component={HomeScreen} />
          <AuthStack.Screen name="RegisterScreen" component={RegisterScreen} />
          <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
        </AuthStack.Group>
      )}
    </AuthStack.Navigator>
  );
};

export default Navigation;
