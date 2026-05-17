import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        user: {
            name: string;
            email: string;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
    }>;
    getMe(userId: string): Promise<{
        name: string;
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private generateToken;
}
