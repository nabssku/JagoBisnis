"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PakasirCheckoutProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PakasirCheckoutProvider = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let PakasirCheckoutProvider = PakasirCheckoutProvider_1 = class PakasirCheckoutProvider {
    logger = new common_1.Logger(PakasirCheckoutProvider_1.name);
    generateCheckoutUrl(projectSlug, amount, orderId, redirectUrl) {
        const baseUrl = `https://app.pakasir.com/pay/${projectSlug}/${amount}`;
        const params = new URLSearchParams({
            order_id: orderId,
            qris_only: '1',
        });
        if (redirectUrl) {
            params.append('redirect', redirectUrl);
        }
        return `${baseUrl}?${params.toString()}`;
    }
    async verifyTransaction(projectSlug, amount, orderId, apiKey) {
        try {
            const response = await axios_1.default.get(`https://app.pakasir.com/api/transactiondetail`, {
                params: {
                    project: projectSlug,
                    amount: amount,
                    order_id: orderId,
                    api_key: apiKey,
                },
            });
            if (response.data) {
                this.logger.log(`Verified Pakasir transaction ${orderId}: status=${response.data.status}`);
                return {
                    status: response.data.status,
                    method: response.data.payment_method,
                    completedAt: response.data.completed_at,
                };
            }
            return null;
        }
        catch (error) {
            this.logger.error(`Error verifying Pakasir transaction ${orderId}: ${error.message}`, error.stack);
            return null;
        }
    }
};
exports.PakasirCheckoutProvider = PakasirCheckoutProvider;
exports.PakasirCheckoutProvider = PakasirCheckoutProvider = PakasirCheckoutProvider_1 = __decorate([
    (0, common_1.Injectable)()
], PakasirCheckoutProvider);
//# sourceMappingURL=pakasir-checkout.provider.js.map