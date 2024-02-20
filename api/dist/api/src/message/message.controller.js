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
const list_message_dto_1 = require("../../../shared/src/messages/list-message/list-message.dto");
const list_message_schemas_1 = require("../../../shared/src/messages/list-message/list-message.schemas");
const common_1 = require("@nestjs/common");
const auth_context_1 = require("../auth/auth-context");
const auth_context_decorator_1 = require("../auth/auth-context.decorator");
const prisma_client_service_1 = require("../internals/database/prisma-client.service");
const resource_not_found_exception_1 = require("../internals/server/resource-not-found.exception");
const validation_pipe_1 = require("../internals/validation/validation.pipe");
const lastMessage = (conversation) => {
    return Object.assign(Object.assign({}, conversation), { messages: conversation.messages.length > 0
            ? conversation.messages[conversation.messages.length - 1]
            : [] });
};
let MessageController = class MessageController {
    constructor(prisma) {
        this.prisma = prisma;
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
    async getToken(authContext, listMessage) {
        return this.prisma.getClient().$transaction(async (tx) => {
            const getMessages = await tx.conversation.findFirst({
                where: {
                    id: listMessage.conversationId,
                },
            });
            if (!getMessages)
                throw new resource_not_found_exception_1.ResourceNotFoundException('Convo does not exist');
            if (getMessages.userId !== authContext.user.id) {
                const getToken = await tx.pushToken.findFirst({
                    where: { userId: getMessages.userId },
                });
                return getToken === null || getToken === void 0 ? void 0 : getToken.token;
            }
            else if (getMessages.recipientId !== authContext.user.id) {
                const getToken = await tx.pushToken.findFirst({
                    where: { userId: getMessages.recipientId },
                });
                return getToken === null || getToken === void 0 ? void 0 : getToken.token;
            }
            common_1.Logger.log(authContext.user.id);
        });
    }
    async getMessages(authContext, listMessage) {
        const getMessages = await this.prisma.getClient().message.findMany({
            where: {
                conversationId: listMessage.conversationId,
            },
        });
        return getMessages;
    }
    async createConversation(authContext, createConversation) {
        const conversation = await this.prisma.getClient().conversation.create({
            data: {
                userId: authContext.user.id,
                recipientId: createConversation.recipientId,
                userName: createConversation.userName,
                recipientName: createConversation.recipientName,
            },
            include: { messages: true },
        });
        return conversation;
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
    (0, common_1.Get)('/list/rtoken/:conversationId'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, auth_context_decorator_1.WithAuthContext)()),
    __param(1, (0, common_1.Param)(new validation_pipe_1.ValidationPipe(list_message_schemas_1.ListMessageSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_context_1.AuthContext,
        list_message_dto_1.ListMessageDTO]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getToken", null);
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
    __metadata("design:paramtypes", [prisma_client_service_1.PrismaClientService])
], MessageController);
//# sourceMappingURL=message.controller.js.map