"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MediaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const fs = __importStar(require("fs"));
const path_1 = require("path");
let MediaService = MediaService_1 = class MediaService {
    prisma;
    logger = new common_1.Logger(MediaService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(businessId) {
        return this.prisma.media.findMany({
            where: { businessId },
            orderBy: { createdAt: 'desc' },
            include: {
                uploadedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    async create(businessId, userId, file) {
        const mediaCount = await this.prisma.media.count({
            where: { businessId },
        });
        if (mediaCount >= 500) {
            const tempPath = (0, path_1.join)('./uploads', file.filename);
            if (fs.existsSync(tempPath)) {
                try {
                    fs.unlinkSync(tempPath);
                }
                catch (err) {
                    this.logger.error(`Failed to clean up file after limit exceeded: ${err.message}`);
                }
            }
            throw new common_1.BadRequestException('Batas maksimal penyimpanan media (500 file) telah tercapai. Silakan hapus media yang tidak terpakai.');
        }
        const backendUrl = process.env.BACKEND_URL
            ? process.env.BACKEND_URL.replace(/\/$/, '')
            : 'http://localhost:3001';
        const url = `${backendUrl}/uploads/${file.filename}`;
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
            include: {
                uploadedBy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async remove(businessId, mediaId) {
        const media = await this.prisma.media.findFirst({
            where: {
                id: mediaId,
                businessId,
            },
        });
        if (!media) {
            throw new common_1.NotFoundException('Berkas media tidak ditemukan.');
        }
        const filePath = (0, path_1.join)('./uploads', media.filename);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            }
            catch (err) {
                this.logger.warn(`Could not delete physical file: ${filePath}. Error: ${err.message}`);
            }
        }
        else {
            this.logger.warn(`Physical file not found for media deletion: ${filePath}`);
        }
        return this.prisma.media.delete({
            where: { id: mediaId },
        });
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = MediaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MediaService);
//# sourceMappingURL=media.service.js.map