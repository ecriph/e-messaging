import React, { useEffect, useRef, useState } from 'react';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotificationsAsync } from '../service/push-notification';
import * as Notifications from 'expo-notifications';
import { Notification, Subscription } from 'expo-notifications';
import { LOGIN_USER, REGISTER_TOKEN } from '../../redux/user/reducer';
import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../data/const';

Notifications.setNotificationHandler({
  handleNotification: async (notification) => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    content: {
      title: notification.request.content.title, // Include the title in the notification
    },
  }),
});

function useCatchResource(store: any) {
  const [appIsReady, setAppIsReady] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  let customFonts = {
    Bold: require('../../../assets/fonts/Inter-ExtraBold.ttf'),
    Light: require('../../../assets/fonts/Inter-Light.ttf'),
    Medium: require('../../../assets/fonts/Inter-Medium.ttf'),
    Regular: require('../../../assets/fonts/Inter-Regular.ttf'),
    SemiBold: require('../../../assets/fonts/Inter-SemiBold.ttf'),
  };

  useEffect(() => {
    async function loadResourcesAsync() {
      const images = [
        /* Add all heavy images here, This is to load it when the splash screen is loading. 
             With this, It will be available after the splash screen has completed it's loading.
          */
        require('../../../assets/splash.png'),
      ];
      const cacheImages = images.map((image) => {
        return Asset.fromModule(image).downloadAsync();
      });
      return Promise.all(cacheImages);
    }

    async function Auth() {
      await AsyncStorage.getItem(REFRESH_TOKEN)
        .then(async (token) => {
          if (token === null) {
            console.log('no token');
            return;
          } else {
            const resp = await axios.post(
              `https://echat-app-f0f8b632b839.herokuapp.com/auth/refresh-token`,
              { refreshToken: token }
            );
            console.log(resp.data);
            const { access_token, status, fullname, userId } = resp.data;
            if (status === 'success') {
              await AsyncStorage.setItem(ACCESS_TOKEN, access_token);
              await store.dispatch(
                LOGIN_USER({ userId: userId, fullname: fullname })
              );
            } else {
              return;
            }
          }
        })
        .catch((error) => console.log('Error checking authentication:', error));
    }

    async function PushToken() {
      await registerForPushNotificationsAsync().then(async (token) => {
        await store.dispatch(REGISTER_TOKEN({ token: token }));
      });

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
        });
    }

    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();

        await loadResourcesAsync();

        await Auth();

        await PushToken();

        await Font.loadAsync(customFonts);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);
  return appIsReady;
}

export default useCatchResource;
