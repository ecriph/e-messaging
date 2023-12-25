import { BadRequestException } from '@nestjs/common';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { EnvironmentVariables } from 'src/internals/runtime/environment-variables';

export class PushNotificationService {
  private expo = new Expo({
    accessToken: EnvironmentVariables.EXPO_ACCESS_TOKEN,
  });

  async sendPushNotification(
    deviceToken: string,
    message: string,
    username: string,
  ) {
    // const messages: ExpoPushMessage[] = [];

    // for (const token of deviceTokens) {
    //   if (!Expo.isExpoPushToken(token)) {
    //     return;
    //   }

    //   messages.push({
    //     to: token,
    //     sound: 'default',
    //     title: `New Message from ${username}`,
    //     body: message,
    //     data: { message },
    //   });
    // }

    // const chunks = this.expo.chunkPushNotifications(messages);
    // const promises = [];

    // for (const chunk of chunks) {
    //   promises.push(this.expo.sendPushNotificationsAsync(chunk));
    // }

    // try {
    //   await Promise.all(promises);
    //   return;
    // } catch (error) {
    //   return error;
    // }

    const messages: ExpoPushMessage = {
      to: deviceToken,
      sound: 'default',
      title: `From ${username}`,
      body: message,
      data: { someData: 'goes here' },
    };

    try {
      await this.expo.sendPushNotificationsAsync([messages]);
    } catch (error) {
      return new BadRequestException('Error sending notification');
    }
  }
}
