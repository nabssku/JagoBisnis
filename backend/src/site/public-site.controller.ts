import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SiteService } from './site.service';

@ApiTags('public')
@Controller('public')
export class PublicSiteController {
  constructor(private readonly siteService: SiteService) {}

  @Get('sites/:slug')
  @ApiOperation({ summary: 'Get public published site' })
  async getPublicSite(@Param('slug') slug: string) {
    return this.siteService.getPublicSite(slug);
  }
}
