import { BadRequestException } from '@nestjs/common';
export declare class PushNotificationService {
    private expo;
    sendPushNotification(deviceToken: string, message: string, username: string): Promise<BadRequestException | undefined>;
}
