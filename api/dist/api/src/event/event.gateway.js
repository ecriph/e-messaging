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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const prisma_client_service_1 = require("../internals/database/prisma-client.service");
const create_message_dto_1 = require("../../../shared/src/messages/create-message/create-message.dto");
const typing_dto_1 = require("../../../shared/src/messages/message-typing/typing.dto");
const lastMessage = (conversation) => {
    return Object.assign(Object.assign({}, conversation), { messages: conversation.messages.length > 0
            ? conversation.messages[conversation.messages.length - 1]
            : [] });
};
let EventGateway = class EventGateway {
    constructor(prisma) {
        this.prisma = prisma;
    }
    afterInit() {
        common_1.Logger.log('afterinit');
    }
    async handleMessage(socket, data) {
        await socket.join(data.conversationId);
        await this.prisma.getClient().$transaction(async (tx) => {
            await tx.message.create({
                data: {
                    content: data.content,
                    senderId: data.userId,
                    conversationId: data.conversationId,
                    category: data.category,
                },
            });
            const getMessages = await tx.message.findMany({
                where: {
                    conversationId: data.conversationId,
                },
            });
            this.server.to(data.conversationId).emit('receiveMessage', getMessages);
        });
    }
    async handleConvoList(socket, data) {
        const conversation = this.prisma.getClient().conversation.findMany({
            where: {
                OR: [{ userId: data.userId }, { recipientId: data.userId }],
            },
            include: { messages: true },
        });
        const conversationsWithLastMessage = (await conversation).map(lastMessage);
        this.server.emit('conversationList', conversationsWithLastMessage);
    }
    async handleTyping(socket, data) {
        await socket.join(data.conversationId);
        const response = { message: `${data.username} is typing`, id: data.userId };
        this.server.to(data.conversationId).emit('typingResponse', response);
    }
};
exports.EventGateway = EventGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, create_message_dto_1.CreateMessageDTO]),
    __metadata("design:returntype", Promise)
], EventGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('listConvo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventGateway.prototype, "handleConvoList", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('onType'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, typing_dto_1.TypingDTO]),
    __metadata("design:returntype", Promise)
], EventGateway.prototype, "handleTyping", null);
exports.EventGateway = EventGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'events' }),
    __metadata("design:paramtypes", [prisma_client_service_1.PrismaClientService])
], EventGateway);
//# sourceMappingURL=event.gateway.js.map