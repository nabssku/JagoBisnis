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
    getMe(req: {
        user: {
            id: string;
        };
    }): Promise<{
        name: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: {
        user: {
            id: string;
        };
    }, dto: UpdateProfileDto): Promise<{
        name: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
        id: string;
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
}
