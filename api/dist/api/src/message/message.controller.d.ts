import { createConversationDTO } from '@/shared/messages/create-conversation/create-conversation.dto';
import { CreateMessageDTO } from '@/shared/messages/create-message/create-message.dto';
import { ListMessageDTO } from '@/shared/messages/list-message/list-message.dto';
import { AuthContext } from 'src/auth/auth-context';
import { EventGateway } from 'src/event/event.gateway';
import { PushNotificationService } from 'src/internals/api/push-notification/push-notification.service';
import { PrismaClientService } from 'src/internals/database/prisma-client.service';
import { ResourceNotFoundException } from 'src/internals/server/resource-not-found.exception';
export declare class MessageController {
    private readonly prisma;
    private readonly event;
    private readonly sendNotification;
    constructor(prisma: PrismaClientService, event: EventGateway, sendNotification: PushNotificationService);
    getUsers(authContext: AuthContext): Promise<({
        conversations: {
            id: string;
            userId: string;
            userName: string;
            recipientName: string;
            recipientId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        messages: {
            id: string;
            content: string;
            senderId: string;
            conversationId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        fullname: string;
        email: string;
        password: string;
        refresh_token: string;
        role: import(".prisma/client").$Enums.UserRole;
    })[]>;
    getConversations(authContext: AuthContext): Promise<{
        messages: {
            id: string;
            content: string;
            senderId: string;
            conversationId: string;
            createdAt: Date;
            updatedAt: Date;
        } | never[] | undefined;
        id: string;
        userId: string;
        userName: string;
        recipientName: string;
        recipientId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getMessages(authContext: AuthContext, listMessage: ListMessageDTO): Promise<{
        id: string;
        content: string;
        senderId: string;
        conversationId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createMessage(authContext: AuthContext, sendMessage: CreateMessageDTO): Promise<ResourceNotFoundException | {
        id: string;
        content: string;
        senderId: string;
        conversationId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createConversation(authContext: AuthContext, createConversation: createConversationDTO): Promise<{
        messages: {
            id: string;
            content: string;
            senderId: string;
            conversationId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        userId: string;
        userName: string;
        recipientName: string;
        recipientId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
