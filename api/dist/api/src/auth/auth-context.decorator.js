"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithOptionalAuthContext = exports.WithAuthContext = void 0;
const common_1 = require("@nestjs/common");
const auth_context_1 = require("./auth-context");
const throw_error_1 = require("../internals/utils/throw-error");
const typesafe_parameter_decorator_1 = require("../internals/utils/typesafe-parameter-decorator");
exports.WithAuthContext = (0, common_1.createParamDecorator)((data, ctx) => {
    var _a;
    const request = ctx.switchToHttp().getRequest();
    return (_a = request.authContext) !== null && _a !== void 0 ? _a : (0, throw_error_1.throwError)();
}, [(0, typesafe_parameter_decorator_1.EnforceParameterDecoratorTypesafety)(auth_context_1.AuthContext)]);
exports.WithOptionalAuthContext = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.authContext;
}, [(0, typesafe_parameter_decorator_1.EnforceParameterDecoratorTypesafety)(auth_context_1.AuthContext)]);
//# sourceMappingURL=auth-context.decorator.js.map