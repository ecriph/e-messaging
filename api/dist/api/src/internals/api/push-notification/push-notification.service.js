"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationService = void 0;
const common_1 = require("@nestjs/common");
const expo_server_sdk_1 = require("expo-server-sdk");
const environment_variables_1 = require("../../runtime/environment-variables");
class PushNotificationService {
    constructor() {
        this.expo = new expo_server_sdk_1.Expo({
            accessToken: environment_variables_1.EnvironmentVariables.EXPO_ACCESS_TOKEN,
        });
    }
    async sendPushNotification(deviceToken, message, username) {
        const messages = {
            to: deviceToken,
            sound: 'default',
            title: `From ${username}`,
            body: message,
            data: { someData: 'goes here' },
        };
        try {
            await this.expo.sendPushNotificationsAsync([messages]);
        }
        catch (error) {
            return new common_1.BadRequestException('Error sending notification');
        }
    }
}
exports.PushNotificationService = PushNotificationService;
//# sourceMappingURL=push-notification.service.js.map