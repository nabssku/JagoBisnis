import { PrismaService } from '../prisma.service';
import { ConnectPakasirDto } from './dto/connect-pakasir.dto';
import { ConnectGoogleAnalyticsDto } from './dto/connect-google-analytics.dto';
import { InstagramProvider } from './providers/instagram.provider';
import { ThreadsProvider } from './providers/threads.provider';
import { PakasirIntegrationProvider } from './providers/pakasir-integration.provider';
import { GoogleAnalyticsProvider } from './providers/google-analytics.provider';
import { IntegrationProvider } from '@prisma/client';
export declare class IntegrationService {
    private prisma;
    private instagramProvider;
    private threadsProvider;
    private pakasirProvider;
    private gaProvider;
    constructor(prisma: PrismaService, instagramProvider: InstagramProvider, threadsProvider: ThreadsProvider, pakasirProvider: PakasirIntegrationProvider, gaProvider: GoogleAnalyticsProvider);
    findAll(userId: string, businessId: string): Promise<any[]>;
    findOne(userId: string, businessId: string, provider: IntegrationProvider): Promise<any>;
    connectPakasir(userId: string, businessId: string, dto: ConnectPakasirDto): Promise<any>;
    testPakasir(userId: string, businessId: string, dto: ConnectPakasirDto): Promise<{
        success: boolean;
        message: string;
    }>;
    connectGoogleAnalytics(userId: string, businessId: string, dto: ConnectGoogleAnalyticsDto): Promise<any>;
    testGoogleAnalytics(userId: string, businessId: string, dto: ConnectGoogleAnalyticsDto): Promise<{
        success: boolean;
        message: string;
    }>;
    disconnect(userId: string, businessId: string, provider: IntegrationProvider): Promise<{
        success: boolean;
        message: string;
    }>;
    getInstagramConnectUrl(userId: string, businessId: string): Promise<{
        url: string;
    }>;
    handleInstagramCallback(code: string, state: string): Promise<{
        businessId: string;
    }>;
    getThreadsConnectUrl(userId: string, businessId: string): Promise<{
        url: string;
    }>;
    handleThreadsCallback(code: string, state: string): Promise<{
        businessId: string;
    }>;
    private checkAccess;
    private checkPermission;
    private sanitizeIntegration;
}
