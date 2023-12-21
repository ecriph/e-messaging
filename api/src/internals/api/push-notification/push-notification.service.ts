import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { EnvironmentVariables } from 'src/internals/runtime/environment-variables';

export class PushNotificationService {
  private expo = new Expo({
    accessToken: EnvironmentVariables.EXPO_ACCESS_TOKEN,
  });

  async sendPushNotification(deviceTokens: string[], message: string) {
    const messages: ExpoPushMessage[] = [];

    for (const token of deviceTokens) {
      if (!Expo.isExpoPushToken(token)) {
        return;
      }

      messages.push({
        to: token,
        sound: 'default',
        body: message,
        data: { message },
      });
    }

    const chunks = this.expo.chunkPushNotifications(messages);
    const promises = [];

    for (const chunk of chunks) {
      promises.push(this.expo.sendPushNotificationsAsync(chunk));
    }

    try {
      await Promise.all(promises);
      return;
    } catch (error) {
      return error;
    }
  }
}
