"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowRoles = exports.ROUTE_ROLES_METADATA_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ROUTE_ROLES_METADATA_KEY = 'route-roles';
const AllowRoles = (allowedRoles) => {
    const metadata = {
        allowedRoles,
    };
    return (0, common_1.SetMetadata)(exports.ROUTE_ROLES_METADATA_KEY, metadata);
};
exports.AllowRoles = AllowRoles;
//# sourceMappingURL=roles.decorator.js.map