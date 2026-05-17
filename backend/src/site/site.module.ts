import { Module } from '@nestjs/common';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { PublicSiteController } from './public-site.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SiteController, PublicSiteController],
  providers: [SiteService, PrismaService],
})
export class SiteModule {}
