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
exports.SuperAdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const superadmin_guard_1 = require("../auth/guards/superadmin.guard");
const superadmin_service_1 = require("./superadmin.service");
const update_user_role_dto_1 = require("./dto/update-user-role.dto");
let SuperAdminController = class SuperAdminController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getStats() {
        return this.service.getPlatformStats();
    }
    async getUsers() {
        return this.service.getUsersList();
    }
    async updateUserRole(userId, dto) {
        return this.service.updateUserRole(userId, dto.role);
    }
    async getBusinesses() {
        return this.service.getBusinessesList();
    }
    async deleteBusiness(businessId) {
        return this.service.deleteBusiness(businessId);
    }
};
exports.SuperAdminController = SuperAdminController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({
        summary: 'Dapatkan statistik performa & pertumbuhan seluruh platform',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Dapatkan direktori semua pengguna yang terdaftar' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Put)('users/:id/role'),
    (0, swagger_1.ApiOperation)({
        summary: 'Perbarui tingkat otorisasi peran pengguna (User -> SuperAdmin)',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_role_dto_1.UpdateUserRoleDto]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "updateUserRole", null);
__decorate([
    (0, common_1.Get)('businesses'),
    (0, swagger_1.ApiOperation)({
        summary: 'Dapatkan direktori semua profil bisnis UMKM yang terdaftar',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getBusinesses", null);
__decorate([
    (0, common_1.Delete)('businesses/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Hapus bisnis & seluruh relasi datanya secara permanen (Moderasi)',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "deleteBusiness", null);
exports.SuperAdminController = SuperAdminController = __decorate([
    (0, swagger_1.ApiTags)('superadmin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, superadmin_guard_1.SuperAdminGuard),
    (0, common_1.Controller)('superadmin'),
    __metadata("design:paramtypes", [superadmin_service_1.SuperAdminService])
], SuperAdminController);
//# sourceMappingURL=superadmin.controller.js.map