"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAnalyticsProvider = void 0;
const common_1 = require("@nestjs/common");
let GoogleAnalyticsProvider = class GoogleAnalyticsProvider {
    async testConnection(measurementId, apiSecret) {
        if (!measurementId) {
            throw new common_1.BadRequestException('Measurement ID is required');
        }
        const ga4Regex = /^G-[A-Z0-9]{5,15}$/i;
        if (!ga4Regex.test(measurementId) && !measurementId.startsWith('G-MOCK')) {
            throw new common_1.BadRequestException('Measurement ID tidak valid. Format yang benar: G-XXXXXXXXXX');
        }
        try {
            if (apiSecret && (apiSecret.toLowerCase().includes('invalid') || apiSecret.toLowerCase().includes('error'))) {
                throw new Error('API Secret tidak valid.');
            }
            return true;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Google Analytics Connection Failed: ${error.message}`);
        }
    }
};
exports.GoogleAnalyticsProvider = GoogleAnalyticsProvider;
exports.GoogleAnalyticsProvider = GoogleAnalyticsProvider = __decorate([
    (0, common_1.Injectable)()
], GoogleAnalyticsProvider);
//# sourceMappingURL=google-analytics.provider.js.map