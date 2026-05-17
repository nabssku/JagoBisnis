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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let ProductService = class ProductService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, businessId, dto) {
        await this.checkPermission(userId, businessId);
        const slug = dto.slug || this.generateSlug(dto.name);
        const existingProduct = await this.prisma.product.findUnique({
            where: {
                businessId_slug: { businessId, slug },
            },
        });
        if (existingProduct) {
            throw new common_1.ConflictException('Product slug already exists in this business');
        }
        return this.prisma.product.create({
            data: {
                ...dto,
                slug,
                businessId,
            },
        });
    }
    async findAll(userId, businessId) {
        await this.checkAccess(userId, businessId);
        return this.prisma.product.findMany({
            where: {
                businessId,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(userId, businessId, id) {
        await this.checkAccess(userId, businessId);
        const product = await this.prisma.product.findFirst({
            where: { id, businessId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async update(userId, businessId, id, dto) {
        await this.checkPermission(userId, businessId);
        const product = await this.findOne(userId, businessId, id);
        if (dto.slug && dto.slug !== product.slug) {
            const existingProduct = await this.prisma.product.findUnique({
                where: {
                    businessId_slug: { businessId, slug: dto.slug },
                },
            });
            if (existingProduct) {
                throw new common_1.ConflictException('Product slug already exists in this business');
            }
        }
        return this.prisma.product.update({
            where: { id },
            data: dto,
        });
    }
    async remove(userId, businessId, id) {
        await this.checkPermission(userId, businessId);
        await this.findOne(userId, businessId, id);
        return this.prisma.product.delete({
            where: { id },
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
    async createMedia(userId, businessId, file) {
        const mediaCount = await this.prisma.media.count({
            where: { businessId },
        });
        if (mediaCount >= 500) {
            throw new common_1.ConflictException('Batas maksimal penyimpanan media (500 file) telah tercapai.');
        }
        const url = `http://localhost:3001/uploads/${file.filename}`;
        return this.prisma.media.create({
            data: {
                businessId,
                uploadedById: userId,
                url,
                filename: file.filename,
                name: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
            },
        });
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductService);
//# sourceMappingURL=product.service.js.map