import React, { useEffect, useState } from 'react';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { confirmToken } from '../../redux/user/action';

function useCatchResource(store: { dispatch: (arg0: () => void) => any }) {
  const [appIsReady, setAppIsReady] = useState(false);

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
      await AsyncStorage.getItem('token')
        .then(async (token) => {
          if (token === null) {
            return;
          }
          await getUserCredentials(token);
        })
        .catch((error) => console.log('Error checking authentication:', error));
    }

    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();

        await loadResourcesAsync();

        await Auth();

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
