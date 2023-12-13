import type { Abstract, Type } from '@nestjs/common';
type Class = Type<unknown> | Abstract<unknown>;
export declare function EnforceParameterDecoratorTypesafety(parameterClass: Class): ParameterDecorator;
export {};
