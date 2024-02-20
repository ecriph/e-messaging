import React, { useEffect, useRef, useState } from 'react';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { confirmToken } from '../../redux/user/action';
import { registerForPushNotificationsAsync } from '../service/push-notification';
import * as Notifications from 'expo-notifications';
import { Notification, Subscription } from 'expo-notifications';
import { LOGIN_USER, REGISTER_TOKEN } from '../../redux/user/reducer';
import { EnvironmentVariables } from '../runtime/environment-vairables';
import axios from 'axios';
import { REFRESHTOKEN, ACCESSTOKEN } from '../data/const';

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

  const getUserCredentials = async (token: string) => {
    await store.dispatch(confirmToken(token));
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
      await AsyncStorage.getItem(REFRESHTOKEN)
        .then(async (token) => {
          if (token === null) {
            return;
          } else {
            const resp = await axios.post(
              `${EnvironmentVariables.MAIN_API_URL}/auth/refresh-token`,
              { refreshToken: token }
            );
            const { access_token, refresh_token, fullname, userId } = resp.data;
            // if (status === 'success') {
            AsyncStorage.setItem(ACCESSTOKEN, access_token);
            await store.dispatch(
              LOGIN_USER({ userId: userId, fullname: fullname })
            );
            // } else {
            //   return;
            // }
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
        AsyncStorage.clear();
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
