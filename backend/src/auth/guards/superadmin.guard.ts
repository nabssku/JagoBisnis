import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = request.user;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!user || user.role !== 'SUPERADMIN') {
      throw new ForbiddenException('Akses ditolak: Hanya SuperAdmin yang diizinkan');
    }

    return true;
  }
}
