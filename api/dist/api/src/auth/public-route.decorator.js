"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicRoute = exports.PUBLIC_ROUTE_METADATA_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PUBLIC_ROUTE_METADATA_KEY = 'publicRoute';
const PublicRoute = () => {
    const metadata = true;
    return (0, common_1.SetMetadata)(exports.PUBLIC_ROUTE_METADATA_KEY, metadata);
};
exports.PublicRoute = PublicRoute;
//# sourceMappingURL=public-route.decorator.js.map