"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnforceParameterDecoratorTypesafety = void 0;
const throw_error_1 = require("./throw-error");
function EnforceParameterDecoratorTypesafety(parameterClass) {
    const enchancer = (target, propertyKey, parameterIndex) => {
        if (!propertyKey) {
            throw new Error();
        }
        const parametersTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
        const targetDescription = `Parameter [${parameterIndex}] from method ${propertyKey.toString()} in ${target.constructor.name}`;
        const parameterType = parametersTypes[parameterIndex] ||
            (0, throw_error_1.throwError)(`${targetDescription} does not have a type defined`);
        if (parameterType !== parameterClass) {
            throw new Error(`${targetDescription} must have its type defined as ${parameterClass.name}.
If it's an optional parameter, declare it as 'parameterName?: ${parameterClass.name}'`);
        }
    };
    return enchancer;
}
exports.EnforceParameterDecoratorTypesafety = EnforceParameterDecoratorTypesafety;
//# sourceMappingURL=typesafe-parameter-decorator.js.map