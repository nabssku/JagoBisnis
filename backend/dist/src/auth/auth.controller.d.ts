import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
            phone: string | null;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
            phone: string | null;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
    }>;
    getMe(req: {
        user: {
            id: string;
        };
    }): Promise<{
        id: string;
        email: string;
        name: string;
        avatarUrl: string | null;
        phone: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: {
        user: {
            id: string;
        };
    }, dto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        name: string;
        avatarUrl: string | null;
        phone: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePassword(req: {
        user: {
            id: string;
        };
    }, dto: UpdatePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    googleLogin(accessToken: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
            phone: string | null;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
    }>;
}
