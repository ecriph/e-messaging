"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const core_1 = require("@nestjs/core");
const all_exceptions_filter_1 = require("./internals/error-handling/all-exceptions.filter");
const logging_module_1 = require("./internals/logging/logging.module");
const message_module_1 = require("./message/message.module");
const event_module_1 = require("./event/event.module");
const prisma_client_module_1 = require("./internals/database/prisma-client.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            logging_module_1.LoggingModule,
            auth_module_1.AuthModule,
            message_module_1.MessageModule,
            event_module_1.EventModule,
            prisma_client_module_1.PrismaClientModule,
        ],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: all_exceptions_filter_1.AllExceptionsFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map