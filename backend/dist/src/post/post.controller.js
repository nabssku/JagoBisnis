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
exports.PostController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const post_service_1 = require("./post.service");
const create_post_dto_1 = require("./dto/create-post.dto");
const update_post_dto_1 = require("./dto/update-post.dto");
let PostController = class PostController {
    postService;
    constructor(postService) {
        this.postService = postService;
    }
    create(req, businessId, dto) {
        return this.postService.create(req.user.id, businessId, dto);
    }
    findAll(req, businessId) {
        return this.postService.findAll(req.user.id, businessId);
    }
    findOne(req, businessId, productId) {
        return this.postService.findOne(req.user.id, businessId, productId);
    }
    update(req, businessId, postId, dto) {
        return this.postService.update(req.user.id, businessId, postId, dto);
    }
    remove(req, businessId, postId) {
        return this.postService.remove(req.user.id, businessId, postId);
    }
    getPublicPosts(businessSlug) {
        return this.postService.findPublicPosts(businessSlug);
    }
    getPublicPost(businessSlug, postSlug) {
        return this.postService.findPublicPostBySlug(businessSlug, postSlug);
    }
};
exports.PostController = PostController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('businesses/:businessId/posts'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new blog/post content' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Post successfully created' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_post_dto_1.CreatePostDto]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('businesses/:businessId/posts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all posts for a business' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('businesses/:businessId/posts/:postId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get post details by ID' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __param(2, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('businesses/:businessId/posts/:postId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update post content' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __param(2, (0, common_1.Param)('postId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, update_post_dto_1.UpdatePostDto]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('businesses/:businessId/posts/:postId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete post content' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __param(2, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('public/sites/:businessSlug/posts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all public published posts for a business' }),
    __param(0, (0, common_1.Param)('businessSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "getPublicPosts", null);
__decorate([
    (0, common_1.Get)('public/sites/:businessSlug/posts/:postSlug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get public published post by slug (and increment views count)' }),
    __param(0, (0, common_1.Param)('businessSlug')),
    __param(1, (0, common_1.Param)('postSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "getPublicPost", null);
exports.PostController = PostController = __decorate([
    (0, swagger_1.ApiTags)('posts'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [post_service_1.PostService])
], PostController);
//# sourceMappingURL=post.controller.js.map