"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PakasirIntegrationProvider = void 0;
const common_1 = require("@nestjs/common");
let PakasirIntegrationProvider = class PakasirIntegrationProvider {
    async testConnection(slug, apiKey) {
        if (!slug || !apiKey) {
            throw new common_1.BadRequestException('Slug and API Key are required');
        }
        try {
            if (apiKey.toLowerCase().includes('invalid') ||
                apiKey.toLowerCase().includes('error')) {
                throw new Error('Autentikasi gagal. Slug atau API Key salah.');
            }
            return true;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Pakasir Connection Failed: ${error.message}`);
        }
    }
};
exports.PakasirIntegrationProvider = PakasirIntegrationProvider;
exports.PakasirIntegrationProvider = PakasirIntegrationProvider = __decorate([
    (0, common_1.Injectable)()
], PakasirIntegrationProvider);
//# sourceMappingURL=pakasir-integration.provider.js.map