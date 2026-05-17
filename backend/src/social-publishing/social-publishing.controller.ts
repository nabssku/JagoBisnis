import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SocialPublishingService } from './social-publishing.service';
import { CreateSocialPostDto } from './dto/create-social-post.dto';

interface RequestWithUser {
  user: {
    id: string;
    email: string;
  };
}

@ApiTags('social-publishing')
@Controller('businesses/:businessId/social-posts')
export class SocialPublishingController {
  constructor(private readonly publishingService: SocialPublishingService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new social post draft' })
  @ApiResponse({ status: 201, description: 'Social post draft successfully created' })
  create(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Body() dto: CreateSocialPostDto,
  ) {
    return this.publishingService.create(req.user.id, businessId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all social posts of a business' })
  findAll(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
  ) {
    return this.publishingService.findAll(req.user.id, businessId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':postId')
  @ApiOperation({ summary: 'Get details of a specific social post' })
  findOne(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Param('postId') postId: string,
  ) {
    return this.publishingService.findOne(req.user.id, businessId, postId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  @ApiOperation({ summary: 'Delete a draft or failed social post' })
  remove(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Param('postId') postId: string,
  ) {
    return this.publishingService.remove(req.user.id, businessId, postId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':postId/publish')
  @ApiOperation({ summary: 'Publish draft social post to external platform' })
  publish(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Param('postId') postId: string,
  ) {
    return this.publishingService.publish(req.user.id, businessId, postId);
  }
}
