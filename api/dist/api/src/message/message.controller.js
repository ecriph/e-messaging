"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const openapi = require("@nestjs/swagger");
const create_conversation_dto_1 = require("../../../shared/src/messages/create-conversation/create-conversation.dto");
const create_conversation_schemas_1 = require("../../../shared/src/messages/create-conversation/create-conversation.schemas");
const create_message_dto_1 = require("../../../shared/src/messages/create-message/create-message.dto");
const create_message_schemas_1 = require("../../../shared/src/messages/create-message/create-message.schemas");
const list_message_dto_1 = require("../../../shared/src/messages/list-message/list-message.dto");
const list_message_schemas_1 = require("../../../shared/src/messages/list-message/list-message.schemas");
const common_1 = require("@nestjs/common");
const auth_context_1 = require("../auth/auth-context");
const auth_context_decorator_1 = require("../auth/auth-context.decorator");
const event_gateway_1 = require("../event/event.gateway");
const push_notification_service_1 = require("../internals/api/push-notification/push-notification.service");
const prisma_client_service_1 = require("../internals/database/prisma-client.service");
const resource_not_found_exception_1 = require("../internals/server/resource-not-found.exception");
const validation_pipe_1 = require("../internals/validation/validation.pipe");
function lastMessage(conversation) {
    return Object.assign(Object.assign({}, conversation), { messages: conversation.messages.length > 0
            ? conversation.messages[conversation.messages.length - 1]
            : [] });
}
function getUserNameRow(names, userId) {
    const filteredName = names.find((user) => user.id === userId);
    return filteredName ? filteredName.fullname : '';
}
let MessageController = class MessageController {
    constructor(prisma, event, sendNotification) {
        this.prisma = prisma;
        this.event = event;
        this.sendNotification = sendNotification;
    }
    async getUsers(authContext) {
        const users = await this.prisma.getClient().user.findMany({
            include: { messages: true, conversations: true },
        });
        const filteredUsers = users.filter((user) => user.id !== authContext.user.id);
        return filteredUsers;
    }
    async getConversations(authContext) {
        const conversation = this.prisma.getClient().conversation.findMany({
            where: {
                OR: [
                    { userId: authContext.user.id },
                    { recipientId: authContext.user.id },
                ],
            },
            include: { messages: true },
        });
        const conversationsWithLastMessage = (await conversation).map(lastMessage);
        return conversationsWithLastMessage;
    }
    async getMessages(authContext, listMessage) {
        const getMessages = await this.prisma.getClient().message.findMany({
            where: {
                conversationId: listMessage.conversationId,
            },
        });
        return getMessages;
    }
    async createMessage(authContext, sendMessage) {
        return await this.prisma.getClient().$transaction(async (tx) => {
            const message = await tx.message.create({
                data: {
                    content: sendMessage.content,
                    senderId: authContext.user.id,
                    conversationId: sendMessage.conversationId,
                },
            });
            const getToken = await tx.pushToken.findUnique({
                where: { userId: authContext.user.id },
            });
            if (!getToken)
                return new resource_not_found_exception_1.ResourceNotFoundException();
            const pushToken = [getToken.token];
            this.event.sendMessage(message);
            await this.sendNotification.sendPushNotification(pushToken, sendMessage.content);
            return message;
        });
    }
    async createConversation(authContext, createConversation) {
        return this.prisma.getClient().$transaction(async (tx) => {
            const checkDuplicate = await tx.conversation.findFirst({
                where: {
                    OR: [
                        {
                            userId: authContext.user.id,
                            recipientId: createConversation.recipientId,
                        },
                        {
                            userId: createConversation.recipientId,
                            recipientId: authContext.user.id,
                        },
                    ],
                },
                include: { messages: true },
            });
            if (checkDuplicate) {
                return checkDuplicate;
            }
            const getNames = await tx.user.findMany({
                where: {
                    OR: [
                        { id: authContext.user.id },
                        { id: createConversation.recipientId },
                    ],
                },
            });
            const userName = getUserNameRow(getNames, authContext.user.id);
            const recipientName = getUserNameRow(getNames, createConversation.recipientId);
            const conversation = await tx.conversation.create({
                data: {
                    userId: authContext.user.id,
                    recipientId: createConversation.recipientId,
                    recipientName: recipientName,
                    userName: userName,
                },
                include: { messages: true },
            });
            return conversation;
        });
    }
};
exports.MessageController = MessageController;
__decorate([
    (0, common_1.Get)('/list/users'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, auth_context_decorator_1.WithAuthContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_context_1.AuthContext]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('/list/conversation'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, auth_context_decorator_1.WithAuthContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_context_1.AuthContext]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Get)('/list/message/:conversationId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, auth_context_decorator_1.WithAuthContext)()),
    __param(1, (0, common_1.Param)(new validation_pipe_1.ValidationPipe(list_message_schemas_1.ListMessageSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_context_1.AuthContext,
        list_message_dto_1.ListMessageDTO]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('/create/message'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, auth_context_decorator_1.WithAuthContext)()),
    __param(1, (0, common_1.Body)(new validation_pipe_1.ValidationPipe(create_message_schemas_1.CreateMessageSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_context_1.AuthContext,
        create_message_dto_1.CreateMessageDTO]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createMessage", null);
__decorate([
    (0, common_1.Post)('/create/conversation'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, auth_context_decorator_1.WithAuthContext)()),
    __param(1, (0, common_1.Body)(new validation_pipe_1.ValidationPipe(create_conversation_schemas_1.CreateConversationSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_context_1.AuthContext,
        create_conversation_dto_1.createConversationDTO]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createConversation", null);
exports.MessageController = MessageController = __decorate([
    (0, common_1.Controller)({ path: 'message', version: '1' }),
    __metadata("design:paramtypes", [prisma_client_service_1.PrismaClientService,
        event_gateway_1.EventGateway,
        push_notification_service_1.PushNotificationService])
], MessageController);
//# sourceMappingURL=message.controller.js.map