import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        user: {
            name: string;
            email: string;
            phone: string | null;
            avatarUrl: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            name: string;
            email: string;
            phone: string | null;
            avatarUrl: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
    }>;
    getMe(userId: string): Promise<{
        name: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        name: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePassword(userId: string, dto: UpdatePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    googleLogin(googleAccessToken: string): Promise<{
        user: {
            name: string;
            email: string;
            phone: string | null;
            avatarUrl: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
    }>;
    private generateToken;
}
