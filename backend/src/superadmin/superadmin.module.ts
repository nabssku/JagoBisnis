import { Module } from '@nestjs/common';
import { SuperAdminService } from './superadmin.service';
import { SuperAdminController } from './superadmin.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SuperAdminController],
  providers: [SuperAdminService, PrismaService],
  exports: [SuperAdminService],
})
export class SuperAdminModule {}
