"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const express = __importStar(require("express"));
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const integration_service_1 = require("./integration.service");
const connect_pakasir_dto_1 = require("./dto/connect-pakasir.dto");
const connect_google_analytics_dto_1 = require("./dto/connect-google-analytics.dto");
const client_1 = require("@prisma/client");
let IntegrationController = class IntegrationController {
    integrationService;
    constructor(integrationService) {
        this.integrationService = integrationService;
    }
    findAll(req, businessId) {
        return this.integrationService.findAll(req.user.id, businessId);
    }
    findOne(req, businessId, provider) {
        return this.integrationService.findOne(req.user.id, businessId, provider);
    }
    disconnect(req, businessId, provider) {
        return this.integrationService.disconnect(req.user.id, businessId, provider);
    }
    connectPakasir(req, businessId, dto) {
        return this.integrationService.connectPakasir(req.user.id, businessId, dto);
    }
    updatePakasir(req, businessId, dto) {
        return this.integrationService.connectPakasir(req.user.id, businessId, dto);
    }
    testPakasir(req, businessId, dto) {
        return this.integrationService.testPakasir(req.user.id, businessId, dto);
    }
    connectGoogleAnalytics(req, businessId, dto) {
        return this.integrationService.connectGoogleAnalytics(req.user.id, businessId, dto);
    }
    updateGoogleAnalytics(req, businessId, dto) {
        return this.integrationService.connectGoogleAnalytics(req.user.id, businessId, dto);
    }
    testGoogleAnalytics(req, businessId, dto) {
        return this.integrationService.testGoogleAnalytics(req.user.id, businessId, dto);
    }
    getInstagramConnect(req, businessId) {
        return this.integrationService.getInstagramConnectUrl(req.user.id, businessId);
    }
    async instagramCallback(code, state, res) {
        const rawFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const frontendUrl = rawFrontendUrl.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
        try {
            const { businessId } = await this.integrationService.handleInstagramCallback(code, state);
            return res.redirect(`${frontendUrl}/dashboard/business/${businessId}/integrations?provider=instagram&status=success`);
        }
        catch (error) {
            return res.redirect(`${frontendUrl}/dashboard?status=error&message=${encodeURIComponent(error.message)}`);
        }
    }
    getThreadsConnect(req, businessId) {
        return this.integrationService.getThreadsConnectUrl(req.user.id, businessId);
    }
    async threadsCallback(code, state, res) {
        const rawFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const frontendUrl = rawFrontendUrl.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
        try {
            const { businessId } = await this.integrationService.handleThreadsCallback(code, state);
            return res.redirect(`${frontendUrl}/dashboard/business/${businessId}/integrations?provider=threads&status=success`);
        }
        catch (error) {
            return res.redirect(`${frontendUrl}/dashboard?status=error&message=${encodeURIComponent(error.message)}`);
        }
    }
};
exports.IntegrationController = IntegrationController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('businesses/:businessId/integrations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all connected integrations for a business' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], IntegrationController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('businesses/:businessId/integrations/:provider'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed integration configuration for a provider' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __param(2, (0, common_1.Param)('provider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], IntegrationController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('businesses/:businessId/integrations/:provider'),
    (0, swagger_1.ApiOperation)({ summary: 'Disconnect an integration provider' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __param(2, (0, common_1.Param)('provider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], IntegrationController.prototype, "disconnect", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('businesses/:businessId/integrations/pakasir'),
    (0, swagger_1.ApiOperation)({ summary: 'Connect Pakasir integration' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, connect_pakasir_dto_1.ConnectPakasirDto]),
    __metadata("design:returntype", void 0)
], IntegrationController.prototype, "connectPakasir", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('businesses/:businessId/integrations/pakasir'),
    (0, swagger_1.ApiOperation)({ summary: 'Update Pakasir integration' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, connect_pakasir_dto_1.ConnectPakasirDto]),
    __metadata("design:returntype", void 0)
], IntegrationController.prototype, "updatePakasir", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('businesses/:businessId/integrations/pakasir/test'),
    (0, swagger_1.ApiOperation)({ summary: 'Test connection to Pakasir service' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, connect_pakasir_dto_1.ConnectPakasirDto]),
    __metadata("design:returntype", void 0)
], IntegrationController.prototype, "testPakasir", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('businesses/:businessId/integrations/google-analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Connect Google Analytics integration' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, connect_google_analytics_dto_1.ConnectGoogleAnalyticsDto]),
    __metadata("design:returntype", void 0)
], IntegrationController.prototype, "connectGoogleAnalytics", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('businesses/:businessId/integrations/google-analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Update Google Analytics integration' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, connect_google_analytics_dto_1.ConnectGoogleAnalyticsDto]),
    __metadata("design:returntype", void 0)
], IntegrationController.prototype, "updateGoogleAnalytics", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('businesses/:businessId/integrations/google-analytics/test'),
    (0, swagger_1.ApiOperation)({ summary: 'Test connection to Google Analytics endpoint' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, connect_google_analytics_dto_1.ConnectGoogleAnalyticsDto]),
    __metadata("design:returntype", void 0)
], IntegrationController.prototype, "testGoogleAnalytics", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('businesses/:businessId/integrations/instagram/connect'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Meta OAuth URL for Instagram' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], IntegrationController.prototype, "getInstagramConnect", null);
__decorate([
    (0, common_1.Get)('integrations/instagram/callback'),
    (0, swagger_1.ApiOperation)({ summary: 'Meta OAuth callback for Instagram' }),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "instagramCallback", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('businesses/:businessId/integrations/threads/connect'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Threads OAuth URL' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], IntegrationController.prototype, "getThreadsConnect", null);
__decorate([
    (0, common_1.Get)('integrations/threads/callback'),
    (0, swagger_1.ApiOperation)({ summary: 'Threads OAuth callback' }),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "threadsCallback", null);
exports.IntegrationController = IntegrationController = __decorate([
    (0, swagger_1.ApiTags)('integrations'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [integration_service_1.IntegrationService])
], IntegrationController);
//# sourceMappingURL=integration.controller.js.map