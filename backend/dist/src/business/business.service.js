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
exports.BusinessService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let BusinessService = class BusinessService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const userBusinessesCount = await this.prisma.businessUser.count({
            where: { userId },
        });
        if (userBusinessesCount >= 1) {
            throw new common_1.ConflictException('Maksimal 1 akun hanya boleh memiliki 1 profil bisnis.');
        }
        const slug = dto.slug || this.generateSlug(dto.name);
        const existingBusiness = await this.prisma.business.findUnique({
            where: { slug },
        });
        if (existingBusiness) {
            throw new common_1.ConflictException('Slug already exists');
        }
        return this.prisma.$transaction(async (tx) => {
            const business = await tx.business.create({
                data: {
                    name: dto.name,
                    slug,
                    description: dto.description,
                    logoUrl: dto.logoUrl,
                    category: dto.category,
                    phone: dto.phone,
                    address: dto.address,
                },
            });
            await tx.businessUser.create({
                data: {
                    userId,
                    businessId: business.id,
                    role: client_1.Role.OWNER,
                },
            });
            return business;
        });
    }
    async findAll(userId) {
        return this.prisma.business.findMany({
            where: {
                BusinessUser: {
                    some: { userId },
                },
            },
            include: {
                BusinessUser: {
                    where: { userId },
                    select: { role: true },
                },
            },
        });
    }
    async findOne(userId, id) {
        const business = await this.prisma.business.findFirst({
            where: {
                id,
                BusinessUser: {
                    some: { userId },
                },
            },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found or access denied');
        }
        return business;
    }
    async update(userId, id, dto) {
        await this.checkPermission(userId, id);
        if (dto.slug) {
            const existingBusiness = await this.prisma.business.findFirst({
                where: {
                    slug: dto.slug,
                    id: { not: id },
                },
            });
            if (existingBusiness) {
                throw new common_1.ConflictException('Slug already exists');
            }
        }
        return this.prisma.business.update({
            where: { id },
            data: dto,
        });
    }
    async remove(userId, id) {
        await this.checkPermission(userId, id, true);
        return this.prisma.$transaction(async (tx) => {
            await tx.businessUser.deleteMany({
                where: { businessId: id },
            });
            return tx.business.delete({
                where: { id },
            });
        });
    }
    async checkPermission(userId, businessId, strict = false) {
        const businessUser = await this.prisma.businessUser.findUnique({
            where: {
                userId_businessId: { userId, businessId },
            },
        });
        if (!businessUser) {
            throw new common_1.NotFoundException('Business not found or access denied');
        }
        const allowedRoles = strict ? [client_1.Role.OWNER] : [client_1.Role.OWNER, client_1.Role.ADMIN];
        if (!allowedRoles.includes(businessUser.role)) {
            throw new common_1.ForbiddenException('You do not have permission to perform this action');
        }
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
};
exports.BusinessService = BusinessService;
exports.BusinessService = BusinessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BusinessService);
//# sourceMappingURL=business.service.js.map