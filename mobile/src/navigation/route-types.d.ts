// eslint-disable-next-line @typescript-eslint/ban-types
export type RootStackParamList = {
  LoginScreen: undefined;
  HomeScreen: undefined;
  RegisterScreen: undefined;
  Dashboard: undefined;
  ChatScreen: undefined;
  ProfileScreen: undefined;
};

/**
 * See https://reactnavigation.org/docs/typescript/#organizing-types
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
