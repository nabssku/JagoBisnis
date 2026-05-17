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
exports.SiteController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const site_service_1 = require("./site.service");
const create_site_dto_1 = require("./dto/create-site.dto");
const update_site_dto_1 = require("./dto/update-site.dto");
const update_site_theme_dto_1 = require("./dto/update-site-theme.dto");
const update_site_sections_dto_1 = require("./dto/update-site-sections.dto");
let SiteController = class SiteController {
    siteService;
    constructor(siteService) {
        this.siteService = siteService;
    }
    async getSite(businessId, req) {
        return this.siteService.getByBusinessId(businessId, req.user.id);
    }
    async createSite(businessId, dto, req) {
        return this.siteService.create(businessId, req.user.id, dto);
    }
    async updateSite(businessId, dto, req) {
        return this.siteService.update(businessId, req.user.id, dto);
    }
    async updateTheme(businessId, dto, req) {
        return this.siteService.updateTheme(businessId, req.user.id, dto.theme);
    }
    async updateSections(businessId, dto, req) {
        return this.siteService.updateSections(businessId, req.user.id, dto.sections);
    }
    async publish(businessId, req) {
        return this.siteService.publish(businessId, req.user.id);
    }
    async unpublish(businessId, req) {
        return this.siteService.unpublish(businessId, req.user.id);
    }
};
exports.SiteController = SiteController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get business site' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "getSite", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create business site' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_site_dto_1.CreateSiteDto, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "createSite", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update business site' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_site_dto_1.UpdateSiteDto, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "updateSite", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('theme'),
    (0, swagger_1.ApiOperation)({ summary: 'Update site theme' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_site_theme_dto_1.UpdateSiteThemeDto, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "updateTheme", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('sections'),
    (0, swagger_1.ApiOperation)({ summary: 'Update site sections' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_site_sections_dto_1.UpdateSiteSectionsDto, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "updateSections", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('publish'),
    (0, swagger_1.ApiOperation)({ summary: 'Publish site' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "publish", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('unpublish'),
    (0, swagger_1.ApiOperation)({ summary: 'Unpublish site' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "unpublish", null);
exports.SiteController = SiteController = __decorate([
    (0, swagger_1.ApiTags)('sites'),
    (0, common_1.Controller)('businesses/:businessId/site'),
    __metadata("design:paramtypes", [site_service_1.SiteService])
], SiteController);
//# sourceMappingURL=site.controller.js.map