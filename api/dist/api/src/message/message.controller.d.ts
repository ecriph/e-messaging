import { createConversationDTO } from '@/shared/messages/create-conversation/create-conversation.dto';
import { CreateMessageDTO } from '@/shared/messages/create-message/create-message.dto';
import { ListMessageDTO } from '@/shared/messages/list-message/list-message.dto';
import { AuthContext } from 'src/auth/auth-context';
import { EventGateway } from 'src/event/event.gateway';
import { PrismaClientService } from 'src/internals/database/prisma-client.service';
export declare class MessageController {
    private readonly prisma;
    private readonly event;
    constructor(prisma: PrismaClientService, event: EventGateway);
    getUsers(authContext: AuthContext): Promise<({
        conversations: {
            id: string;
            userId: string;
            recipientId: string;
            createdAt: Date;
        }[];
        messages: {
            id: string;
            content: string;
            senderId: string;
            conversationId: string;
            createdAt: Date;
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
        } | never[] | undefined;
        id: string;
        userId: string;
        recipientId: string;
        createdAt: Date;
    }[]>;
    getMessages(authContext: AuthContext, listMessage: ListMessageDTO): Promise<{
        id: string;
        content: string;
        senderId: string;
        conversationId: string;
        createdAt: Date;
    }[]>;
    createMessage(authContext: AuthContext, sendMessage: CreateMessageDTO): Promise<{
        id: string;
        content: string;
        senderId: string;
        conversationId: string;
        createdAt: Date;
    }>;
    createConversation(authContext: AuthContext, createConversation: createConversationDTO): Promise<{
        messages: {
            id: string;
            content: string;
            senderId: string;
            conversationId: string;
            createdAt: Date;
        }[];
    } & {
        id: string;
        userId: string;
        recipientId: string;
        createdAt: Date;
    }>;
}
