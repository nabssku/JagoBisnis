"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePublicOrderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePublicOrderDto {
    productId;
    customerName;
    customerPhone;
    customerEmail;
    customerAddress;
    quantity;
    paymentMethod;
    paymentChannel;
    notes;
}
exports.CreatePublicOrderDto = CreatePublicOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID produk yang ingin dibeli', example: 'd3b07384-d113-4ec5-a5df-18071e8b7ec3' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePublicOrderDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nama lengkap pelanggan', example: 'Budi Santoso' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePublicOrderDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nomor telepon pelanggan', example: '081234567890' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePublicOrderDto.prototype, "customerPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email pelanggan', example: 'budi@example.com' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePublicOrderDto.prototype, "customerEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Alamat pengiriman lengkap', example: 'Jl. Merdeka No. 10, Jakarta' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePublicOrderDto.prototype, "customerAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Jumlah produk yang dibeli', example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreatePublicOrderDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metode pembayaran', example: 'MANUAL', enum: ['MANUAL', 'PAKASIR'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^(MANUAL|PAKASIR)$/, {
        message: 'paymentMethod must be either MANUAL or PAKASIR',
    }),
    __metadata("design:type", String)
], CreatePublicOrderDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Saluran pembayaran Pakasir', example: 'qris' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePublicOrderDto.prototype, "paymentChannel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Catatan tambahan untuk pesanan', example: 'Kirim setelah jam 5 sore' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePublicOrderDto.prototype, "notes", void 0);
//# sourceMappingURL=create-public-order.dto.js.map