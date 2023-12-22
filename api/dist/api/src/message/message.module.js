"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModule = void 0;
const common_1 = require("@nestjs/common");
const message_controller_1 = require("./message.controller");
const prisma_client_module_1 = require("../internals/database/prisma-client.module");
const event_module_1 = require("../event/event.module");
const push_notification_module_1 = require("../internals/api/push-notification/push-notification.module");
let MessageModule = class MessageModule {
};
exports.MessageModule = MessageModule;
exports.MessageModule = MessageModule = __decorate([
    (0, common_1.Module)({
        controllers: [message_controller_1.MessageController],
        imports: [prisma_client_module_1.PrismaClientModule, event_module_1.EventModule, push_notification_module_1.PushNotificationModule],
    })
], MessageModule);
//# sourceMappingURL=message.module.js.map