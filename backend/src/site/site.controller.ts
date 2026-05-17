import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { UpdateSiteThemeDto } from './dto/update-site-theme.dto';
import { UpdateSiteSectionsDto } from './dto/update-site-sections.dto';

interface RequestWithUser {
  user: {
    id: string;
    email: string;
  };
}

@ApiTags('sites')
@Controller('businesses/:businessId/site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get business site' })
  async getSite(
    @Param('businessId') businessId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.siteService.getByBusinessId(businessId, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create business site' })
  async createSite(
    @Param('businessId') businessId: string,
    @Body() dto: CreateSiteDto,
    @Request() req: RequestWithUser,
  ) {
    return this.siteService.create(businessId, req.user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiOperation({ summary: 'Update business site' })
  async updateSite(
    @Param('businessId') businessId: string,
    @Body() dto: UpdateSiteDto,
    @Request() req: RequestWithUser,
  ) {
    return this.siteService.update(businessId, req.user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('theme')
  @ApiOperation({ summary: 'Update site theme' })
  async updateTheme(
    @Param('businessId') businessId: string,
    @Body() dto: UpdateSiteThemeDto,
    @Request() req: RequestWithUser,
  ) {
    return this.siteService.updateTheme(businessId, req.user.id, dto.theme);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('sections')
  @ApiOperation({ summary: 'Update site sections' })
  async updateSections(
    @Param('businessId') businessId: string,
    @Body() dto: UpdateSiteSectionsDto,
    @Request() req: RequestWithUser,
  ) {
    return this.siteService.updateSections(businessId, req.user.id, dto.sections);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('publish')
  @ApiOperation({ summary: 'Publish site' })
  async publish(
    @Param('businessId') businessId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.siteService.publish(businessId, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('unpublish')
  @ApiOperation({ summary: 'Unpublish site' })
  async unpublish(
    @Param('businessId') businessId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.siteService.unpublish(businessId, req.user.id);
  }

}
