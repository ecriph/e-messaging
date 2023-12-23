import { BadRequestException } from '@nestjs/common';
export declare class PushNotificationService {
    private expo;
    sendPushNotification(deviceToken: string, message: string): Promise<BadRequestException | undefined>;
}
