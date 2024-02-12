import 'expo-dev-client';
import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/redux/store';
import Navigation from './src/navigation/index-screen';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import useCatchResource from './src/internals/utils/use-catch-resource';
import Loading from './src/internals/ui-kit/loading';
import { StatusBar } from 'expo-status-bar';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function App() {
  const isReady = useCatchResource(store);

  if (!isReady) return <Loading />;

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
              <BottomSheetModalProvider>
                <StatusBar />
                <Navigation />
              </BottomSheetModalProvider>
            </NavigationContainer>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
