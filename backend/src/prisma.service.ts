import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    await this.seedSuperAdmin();
  }

  private async seedSuperAdmin() {
    const email = 'jagobisnis@jago-bisnis.my.id';
    const existing = await this.user.findUnique({
      where: { email },
    });

    if (!existing) {
      console.log('Seeding JagoBisnis SuperAdmin...');
      const hashedPassword = await bcrypt.hash('JagoBisnis12345', 10);
      await this.user.create({
        data: {
          name: 'JagoBisnis SuperAdmin',
          email,
          password: hashedPassword,
          role: 'SUPERADMIN',
        },
      });
      console.log('SuperAdmin successfully seeded!');
    }
  }
}
