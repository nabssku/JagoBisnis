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
exports.SocialPublishingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const social_publishing_service_1 = require("./social-publishing.service");
const create_social_post_dto_1 = require("./dto/create-social-post.dto");
let SocialPublishingController = class SocialPublishingController {
    publishingService;
    constructor(publishingService) {
        this.publishingService = publishingService;
    }
    create(req, businessId, dto) {
        return this.publishingService.create(req.user.id, businessId, dto);
    }
    findAll(req, businessId) {
        return this.publishingService.findAll(req.user.id, businessId);
    }
    findOne(req, businessId, postId) {
        return this.publishingService.findOne(req.user.id, businessId, postId);
    }
    remove(req, businessId, postId) {
        return this.publishingService.remove(req.user.id, businessId, postId);
    }
    publish(req, businessId, postId) {
        return this.publishingService.publish(req.user.id, businessId, postId);
    }
};
exports.SocialPublishingController = SocialPublishingController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new social post draft' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Social post draft successfully created',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_social_post_dto_1.CreateSocialPostDto]),
    __metadata("design:returntype", void 0)
], SocialPublishingController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all social posts of a business' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SocialPublishingController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':postId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get details of a specific social post' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __param(2, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], SocialPublishingController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':postId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a draft or failed social post' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __param(2, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], SocialPublishingController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':postId/publish'),
    (0, swagger_1.ApiOperation)({ summary: 'Publish draft social post to external platform' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __param(2, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], SocialPublishingController.prototype, "publish", null);
exports.SocialPublishingController = SocialPublishingController = __decorate([
    (0, swagger_1.ApiTags)('social-publishing'),
    (0, common_1.Controller)('businesses/:businessId/social-posts'),
    __metadata("design:paramtypes", [social_publishing_service_1.SocialPublishingService])
], SocialPublishingController);
//# sourceMappingURL=social-publishing.controller.js.map