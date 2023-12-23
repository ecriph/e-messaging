import { Text, View, Button, Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export async function registerForPushNotificationsAsync() {
  try {
    let token;

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notification!');
        return;
      }

      // Check if Constants.expoConfig is available
      if (Constants.expoConfig && Constants.expoConfig.extra) {
        token = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig.extra.eas.projectId,
        });
      } else {
        Alert.alert('Constants.expoConfig is null or undefined.');
      }

      console.log(token);
    } else {
      Alert.alert('Must use a physical device for Push Notifications');
    }

    return token?.data; // Use optional chaining to safely access token.data
  } catch (err) {
    console.log('notification error: ' + err);
  }
}

export async function sendPushNotification(
  expoPushToken: string,
  chat: string,
  username: string
) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: `From ${username}`,
    body: chat,
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}
