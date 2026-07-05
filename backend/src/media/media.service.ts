import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Retrieves all media assets for a business
   */
  async findAll(businessId: string) {
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

  /**
   * Creates a database record for an uploaded media file after checking bounds
   */
  async create(
    businessId: string,
    userId: string,
    file: {
      buffer: Buffer;
      originalname: string;
      mimetype: string;
      size: number;
    },
  ) {
    // 1. Check max limits (500 photos/media files)
    const mediaCount = await this.prisma.media.count({
      where: { businessId },
    });

    if (mediaCount >= 500) {
      throw new BadRequestException(
        'Batas maksimal penyimpanan media (500 file) telah tercapai. Silakan hapus media yang tidak terpakai.',
      );
    }

    // 2. Upload to Cloudinary
    let uploadResult;
    try {
      uploadResult = await this.cloudinaryService.uploadFile(file);
    } catch (err) {
      this.logger.error(
        `Failed to upload file to Cloudinary: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException(
        'Gagal mengunggah file ke Cloudinary. Silakan coba lagi.',
      );
    }

    // 3. Create Media record in the database
    return this.prisma.media.create({
      data: {
        businessId,
        uploadedById: userId,
        url: uploadResult.secure_url,
        filename: uploadResult.public_id,
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

  /**
   * Deletes a media asset by ID and business ID
   */
  async remove(businessId: string, mediaId: string) {
    // 1. Find the media record
    const media = await this.prisma.media.findFirst({
      where: {
        id: mediaId,
        businessId,
      },
    });

    if (!media) {
      throw new NotFoundException('Berkas media tidak ditemukan.');
    }

    // 2. Check if the file is local (backward compatibility)
    const isLocal = !media.url.includes('res.cloudinary.com');
    if (isLocal) {
      const filePath = join('./uploads', media.filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          this.logger.warn(
            `Could not delete physical file: ${filePath}. Error: ${err.message}`,
          );
        }
      } else {
        this.logger.warn(
          `Physical file not found for media deletion: ${filePath}`,
        );
      }
    } else {
      // Delete from Cloudinary
      try {
        await this.cloudinaryService.deleteFile(media.filename);
      } catch (err) {
        this.logger.error(
          `Failed to delete file from Cloudinary: ${media.filename}. Error: ${err.message}`,
          err.stack,
        );
      }
    }

    // 3. Delete from database
    return this.prisma.media.delete({
      where: { id: mediaId },
    });
  }
}
