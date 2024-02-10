// eslint-disable-next-line @typescript-eslint/ban-types

export type RootStackParamList = {
  LoginScreen: undefined;
  HomeScreen: undefined;
  RegisterScreen: undefined;
  Dashboard: undefined;
  ChatScreen: { conversationId: string; username: string };
  ProfileScreen: undefined;
  ForgotScreen: undefined;
};

/**
 * See https://reactnavigation.org/docs/typescript/#organizing-types
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
