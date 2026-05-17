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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let PostService = class PostService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, businessId, dto) {
        await this.checkPermission(userId, businessId);
        const slug = dto.slug || this.generateSlug(dto.title);
        const existingPost = await this.prisma.post.findUnique({
            where: {
                businessId_slug: { businessId, slug },
            },
        });
        if (existingPost) {
            throw new common_1.ConflictException('Post slug already exists in this business');
        }
        return this.prisma.post.create({
            data: {
                ...dto,
                slug,
                businessId,
            },
        });
    }
    async findAll(userId, businessId) {
        await this.checkAccess(userId, businessId);
        return this.prisma.post.findMany({
            where: {
                businessId,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(userId, businessId, id) {
        await this.checkAccess(userId, businessId);
        const post = await this.prisma.post.findFirst({
            where: { id, businessId },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        return post;
    }
    async update(userId, businessId, id, dto) {
        await this.checkPermission(userId, businessId);
        const post = await this.findOne(userId, businessId, id);
        if (dto.slug && dto.slug !== post.slug) {
            const existingPost = await this.prisma.post.findUnique({
                where: {
                    businessId_slug: { businessId, slug: dto.slug },
                },
            });
            if (existingPost) {
                throw new common_1.ConflictException('Post slug already exists in this business');
            }
        }
        return this.prisma.post.update({
            where: { id },
            data: dto,
        });
    }
    async remove(userId, businessId, id) {
        await this.checkPermission(userId, businessId);
        await this.findOne(userId, businessId, id);
        return this.prisma.post.delete({
            where: { id },
        });
    }
    async findPublicPosts(businessSlug) {
        const business = await this.prisma.business.findUnique({
            where: { slug: businessSlug },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return this.prisma.post.findMany({
            where: {
                businessId: business.id,
                status: 'Publik',
            },
            orderBy: [
                { isPinned: 'desc' },
                { createdAt: 'desc' }
            ],
        });
    }
    async findPublicPostBySlug(businessSlug, postSlug) {
        const business = await this.prisma.business.findUnique({
            where: { slug: businessSlug },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        const post = await this.prisma.post.findFirst({
            where: {
                businessId: business.id,
                slug: postSlug,
                status: 'Publik',
            },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        return this.prisma.post.update({
            where: { id: post.id },
            data: {
                views: {
                    increment: 1,
                },
            },
        });
    }
    async checkAccess(userId, businessId) {
        const businessUser = await this.prisma.businessUser.findUnique({
            where: {
                userId_businessId: { userId, businessId },
            },
        });
        if (!businessUser) {
            throw new common_1.ForbiddenException('You do not have access to this business');
        }
        return businessUser;
    }
    async checkPermission(userId, businessId) {
        const businessUser = await this.checkAccess(userId, businessId);
        if (businessUser.role === client_1.Role.STAFF) {
            throw new common_1.ForbiddenException('You do not have permission to perform this action');
        }
    }
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostService);
//# sourceMappingURL=post.service.js.map