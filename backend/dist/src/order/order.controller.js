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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const order_service_1 = require("./order.service");
const create_public_order_dto_1 = require("./dto/create-public-order.dto");
const update_order_status_dto_1 = require("./dto/update-order-status.dto");
let OrderController = class OrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    createPublicOrder(slug, dto) {
        return this.orderService.createPublicOrder(slug, dto);
    }
    getPublicOrderStatus(orderId) {
        return this.orderService.getPublicOrderStatus(orderId);
    }
    getBusinessOrders(businessId, req) {
        return this.orderService.getBusinessOrders(businessId, req.user.id);
    }
    getBusinessOrderDetail(businessId, orderId, req) {
        return this.orderService.getBusinessOrderDetail(businessId, orderId, req.user.id);
    }
    updateBusinessOrderStatus(businessId, orderId, req, dto) {
        return this.orderService.updateBusinessOrderStatus(businessId, orderId, req.user.id, dto);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)('public/sites/:slug/orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new public order from a published shop site' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Order created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid data or inactive product/integration' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Site not found' }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_public_order_dto_1.CreatePublicOrderDto]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "createPublicOrder", null);
__decorate([
    (0, common_1.Get)('public/orders/:orderId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get status of a public order (polling)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order status found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "getPublicOrderStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('businesses/:businessId/orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders for a business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders list' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "getBusinessOrders", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('businesses/:businessId/orders/:orderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific order details for a business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order detail data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('orderId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "getBusinessOrderDetail", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)('businesses/:businessId/orders/:orderId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update status/payment state of a business order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - only OWNER or ADMIN allowed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('orderId')),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, update_order_status_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "updateBusinessOrderStatus", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map