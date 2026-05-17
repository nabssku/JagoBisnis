import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    const accessToken = this.generateToken(user.id, user.email, user.role);

    return {
      user: result,
      accessToken,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    const accessToken = this.generateToken(user.id, user.email, user.role);

    return {
      user: result,
      accessToken,
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new ConflictException('Email already in use');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone || null,
        avatarUrl: dto.avatarUrl || null,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = updatedUser;
    return result;
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Password lama tidak sesuai');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return { success: true, message: 'Kata sandi berhasil diperbarui' };
  }

  async googleLogin(googleAccessToken: string) {
    let googleUser: {
      email: string;
      name: string;
      picture?: string;
    };

    if (googleAccessToken.startsWith('mock-google-token')) {
      // Demo / Mock Mode fallback for quick local testing without setting up GCP client keys
      googleUser = {
        email: 'demo-google-user@gmail.com',
        name: 'Demo Google User',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      };
    } else {
      try {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${googleAccessToken}`,
        );
        if (!response.ok) {
          throw new BadRequestException('Gagal memverifikasi token Google.');
        }
        const data: any = await response.json();
        if (!data.email) {
          throw new BadRequestException('Token Google tidak valid.');
        }
        googleUser = {
          email: data.email,
          name: data.name || data.given_name || 'Google User',
          picture: data.picture,
        };
      } catch (err: any) {
        throw new BadRequestException(
          err.message || 'Terjadi kesalahan saat memverifikasi sesi Google.',
        );
      }
    }

    // 1. Check if user already exists
    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      // 2. Register new user with a secure random hashed password
      const randomPassword = Math.random().toString(36) + Date.now().toString(36);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await this.prisma.user.create({
        data: {
          name: googleUser.name,
          email: googleUser.email,
          password: hashedPassword,
          avatarUrl: googleUser.picture || null,
        },
      });
    } else {
      // 3. Optional: update name or avatar if updated from Google
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name: user.name || googleUser.name,
          avatarUrl: user.avatarUrl || googleUser.picture || null,
        },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    const accessToken = this.generateToken(user.id, user.email, user.role);

    return {
      user: result,
      accessToken,
    };
  }

  private generateToken(userId: string, email: string, role: string) {
    return this.jwtService.sign({ userId, email, role });
  }
}
