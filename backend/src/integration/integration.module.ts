import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';
import { InstagramProvider } from './providers/instagram.provider';
import { ThreadsProvider } from './providers/threads.provider';
import { PakasirIntegrationProvider } from './providers/pakasir-integration.provider';
import { GoogleAnalyticsProvider } from './providers/google-analytics.provider';

@Module({
  controllers: [IntegrationController],
  providers: [
    IntegrationService,
    PrismaService,
    InstagramProvider,
    ThreadsProvider,
    PakasirIntegrationProvider,
    GoogleAnalyticsProvider,
  ],
  exports: [IntegrationService, InstagramProvider, ThreadsProvider],
})
export class IntegrationModule {}
