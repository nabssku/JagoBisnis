import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

interface RequestWithUser {
  user: {
    id: string;
    email: string;
  };
}

@ApiTags('posts')
@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  // --- Authenticated Dashboard Routes ---

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('businesses/:businessId/posts')
  @ApiOperation({ summary: 'Create a new blog/post content' })
  @ApiResponse({ status: 201, description: 'Post successfully created' })
  create(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Body() dto: CreatePostDto,
  ) {
    return this.postService.create(req.user.id, businessId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('businesses/:businessId/posts')
  @ApiOperation({ summary: 'Get all posts for a business' })
  findAll(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
  ) {
    return this.postService.findAll(req.user.id, businessId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('businesses/:businessId/posts/:postId')
  @ApiOperation({ summary: 'Get post details by ID' })
  findOne(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Param('postId') productId: string,
  ) {
    return this.postService.findOne(req.user.id, businessId, productId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('businesses/:businessId/posts/:postId')
  @ApiOperation({ summary: 'Update post content' })
  update(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Param('postId') postId: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postService.update(req.user.id, businessId, postId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('businesses/:businessId/posts/:postId')
  @ApiOperation({ summary: 'Delete post content' })
  remove(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Param('postId') postId: string,
  ) {
    return this.postService.remove(req.user.id, businessId, postId);
  }

  // --- Public Unauthenticated Routes ---

  @Get('public/sites/:businessSlug/posts')
  @ApiOperation({ summary: 'Get all public published posts for a business' })
  getPublicPosts(@Param('businessSlug') businessSlug: string) {
    return this.postService.findPublicPosts(businessSlug);
  }

  @Get('public/sites/:businessSlug/posts/:postSlug')
  @ApiOperation({ summary: 'Get public published post by slug (and increment views count)' })
  getPublicPost(
    @Param('businessSlug') businessSlug: string,
    @Param('postSlug') postSlug: string,
  ) {
    return this.postService.findPublicPostBySlug(businessSlug, postSlug);
  }
}
