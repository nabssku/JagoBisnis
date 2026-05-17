import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    getMe(req: {
        user: {
            id: string;
        };
    }): Promise<{
        name: string;
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
