"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingService = void 0;
const util_1 = require("util");
const environment_variables_1 = require("../runtime/environment-variables");
const common_1 = require("@nestjs/common");
function nestedValuesToString(value) {
    return (0, util_1.inspect)(value, undefined, 10);
}
let LoggingService = class LoggingService {
    logDebug(key, extraData) {
        if (environment_variables_1.EnvironmentVariables.LOG_DEBUG) {
            console.log(nestedValuesToString({
                key,
                extraData,
            }));
        }
    }
    logInfo(key, extraData) {
        console.info(nestedValuesToString({
            key,
            extraData,
        }));
    }
    logWarning(key, extraData) {
        console.warn(nestedValuesToString({
            key,
            extraData,
        }));
    }
    logError(key, caughtValue, extraData) {
        console.error(nestedValuesToString({ key, caughtValue, extraData }));
    }
};
exports.LoggingService = LoggingService;
exports.LoggingService = LoggingService = __decorate([
    (0, common_1.Injectable)()
], LoggingService);
//# sourceMappingURL=logging.service.js.map