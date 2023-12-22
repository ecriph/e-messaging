"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationService = void 0;
const expo_server_sdk_1 = require("expo-server-sdk");
const environment_variables_1 = require("../../runtime/environment-variables");
class PushNotificationService {
    constructor() {
        this.expo = new expo_server_sdk_1.Expo({
            accessToken: environment_variables_1.EnvironmentVariables.EXPO_ACCESS_TOKEN,
        });
    }
    async sendPushNotification(deviceTokens, message) {
        const messages = [];
        for (const token of deviceTokens) {
            if (!expo_server_sdk_1.Expo.isExpoPushToken(token)) {
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
        }
        catch (error) {
            return error;
        }
    }
}
exports.PushNotificationService = PushNotificationService;
//# sourceMappingURL=push-notification.service.js.map