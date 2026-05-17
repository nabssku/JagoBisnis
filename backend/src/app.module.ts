import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { BusinessModule } from './business/business.module';
import { ProductModule } from './product/product.module';
import { SiteModule } from './site/site.module';
import { PostModule } from './post/post.module';
import { IntegrationModule } from './integration/integration.module';
import { SocialPublishingModule } from './social-publishing/social-publishing.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
    AuthModule,
    BusinessModule,
    ProductModule,
    SiteModule,
    PostModule,
    IntegrationModule,
    SocialPublishingModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
