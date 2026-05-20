import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MediaService } from './media.service';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
  };
}

@ApiTags('Media')
@Controller('businesses/:businessId/media')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @ApiOperation({ summary: 'Get all media library uploads for a business' })
  findAll(@Param('businessId') businessId: string) {
    return this.mediaService.findAll(businessId);
  }

  @Post()
  @ApiOperation({
    summary: 'Upload a new media library asset (max 50MB image/video)',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `media-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Accept images and videos
        const allowedTypes =
          /^(image\/(jpeg|png|gif|webp|svg\+xml)|video\/(mp4|webm|quicktime))$/i;
        if (!allowedTypes.test(file.mimetype)) {
          return callback(
            new BadRequestException(
              'Format file tidak didukung! Hanya file gambar (JPG, PNG, GIF, WEBP, SVG) dan video (MP4, WEBM) yang diperbolehkan.',
            ),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
      },
    }),
  )
  uploadFile(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('File media wajib diunggah.');
    }
    return this.mediaService.create(businessId, req.user.id, file);
  }

  @Delete(':mediaId')
  @ApiOperation({ summary: 'Delete a media library asset' })
  remove(
    @Param('businessId') businessId: string,
    @Param('mediaId') mediaId: string,
  ) {
    return this.mediaService.remove(businessId, mediaId);
  }
}
