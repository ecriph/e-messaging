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
let EventGateway = class EventGateway {
    constructor() {
        this.connectedUsers = new Set();
        this.unreadMessageCounts = new Map();
    }
    handleConnection(status) {
        this.connectedUsers.add(status.userId);
        this.server.emit('onlineStatus', status);
    }
    sendMessage(message) {
        this.server.emit('newMessage', message);
    }
    handleTyping(status) {
        this.server.emit('typingStatus', status);
    }
    handleMessage(client, payload) {
        const { convoId } = payload;
        this.updateUnreadMessageCount(convoId);
        this.sendUnreadMessageCount(convoId);
    }
    updateUnreadMessageCount(userId) {
        const currentCount = this.unreadMessageCounts.get(userId) || 0;
        this.unreadMessageCounts.set(userId, currentCount + 1);
    }
    sendUnreadMessageCount(userId) {
        const unreadCount = this.unreadMessageCounts.get(userId) || 0;
        this.server.to(userId).emit('unreadMessageCount', { count: unreadCount });
    }
};
exports.EventGateway = EventGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventGateway.prototype, "server", void 0);
exports.EventGateway = EventGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'events' })
], EventGateway);
//# sourceMappingURL=event.gateway.js.map