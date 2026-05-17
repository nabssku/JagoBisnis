"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_pino_1 = require("nestjs-pino");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_service_1 = require("./prisma.service");
const auth_module_1 = require("./auth/auth.module");
const business_module_1 = require("./business/business.module");
const product_module_1 = require("./product/product.module");
const site_module_1 = require("./site/site.module");
const post_module_1 = require("./post/post.module");
const integration_module_1 = require("./integration/integration.module");
const social_publishing_module_1 = require("./social-publishing/social-publishing.module");
const order_module_1 = require("./order/order.module");
const payment_module_1 = require("./payment/payment.module");
const media_module_1 = require("./media/media.module");
const superadmin_module_1 = require("./superadmin/superadmin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    transport: process.env.NODE_ENV !== 'production'
                        ? { target: 'pino-pretty' }
                        : undefined,
                },
            }),
            auth_module_1.AuthModule,
            business_module_1.BusinessModule,
            product_module_1.ProductModule,
            site_module_1.SiteModule,
            post_module_1.PostModule,
            integration_module_1.IntegrationModule,
            social_publishing_module_1.SocialPublishingModule,
            order_module_1.OrderModule,
            payment_module_1.PaymentModule,
            media_module_1.MediaModule,
            superadmin_module_1.SuperAdminModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map