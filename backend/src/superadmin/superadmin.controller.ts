import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../auth/guards/superadmin.guard';
import { SuperAdminService } from './superadmin.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('superadmin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, SuperAdminGuard)
@Controller('superadmin')
export class SuperAdminController {
  constructor(private readonly service: SuperAdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Dapatkan statistik performa & pertumbuhan seluruh platform' })
  async getStats() {
    return this.service.getPlatformStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Dapatkan direktori semua pengguna yang terdaftar' })
  async getUsers() {
    return this.service.getUsersList();
  }

  @Put('users/:id/role')
  @ApiOperation({ summary: 'Perbarui tingkat otorisasi peran pengguna (User -> SuperAdmin)' })
  async updateUserRole(
    @Param('id') userId: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.service.updateUserRole(userId, dto.role);
  }

  @Get('businesses')
  @ApiOperation({ summary: 'Dapatkan direktori semua profil bisnis UMKM yang terdaftar' })
  async getBusinesses() {
    return this.service.getBusinessesList();
  }

  @Delete('businesses/:id')
  @ApiOperation({ summary: 'Hapus bisnis & seluruh relasi datanya secara permanen (Moderasi)' })
  async deleteBusiness(@Param('id') businessId: string) {
    return this.service.deleteBusiness(businessId);
  }
}
