"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const integration_controller_1 = require("./integration.controller");
const integration_service_1 = require("./integration.service");
const instagram_provider_1 = require("./providers/instagram.provider");
const threads_provider_1 = require("./providers/threads.provider");
const pakasir_integration_provider_1 = require("./providers/pakasir-integration.provider");
const google_analytics_provider_1 = require("./providers/google-analytics.provider");
let IntegrationModule = class IntegrationModule {
};
exports.IntegrationModule = IntegrationModule;
exports.IntegrationModule = IntegrationModule = __decorate([
    (0, common_1.Module)({
        controllers: [integration_controller_1.IntegrationController],
        providers: [
            integration_service_1.IntegrationService,
            prisma_service_1.PrismaService,
            instagram_provider_1.InstagramProvider,
            threads_provider_1.ThreadsProvider,
            pakasir_integration_provider_1.PakasirIntegrationProvider,
            google_analytics_provider_1.GoogleAnalyticsProvider,
        ],
        exports: [integration_service_1.IntegrationService, instagram_provider_1.InstagramProvider, threads_provider_1.ThreadsProvider],
    })
], IntegrationModule);
//# sourceMappingURL=integration.module.js.map