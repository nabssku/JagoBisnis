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
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { MediaModule } from './media/media.module';

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
    OrderModule,
    PaymentModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
