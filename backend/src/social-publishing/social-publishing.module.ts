import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SocialPublishingController } from './social-publishing.controller';
import { SocialPublishingService } from './social-publishing.service';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [IntegrationModule],
  controllers: [SocialPublishingController],
  providers: [SocialPublishingService, PrismaService],
})
export class SocialPublishingModule {}
