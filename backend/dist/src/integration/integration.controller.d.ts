import * as express from 'express';
import { IntegrationService } from './integration.service';
import { ConnectPakasirDto } from './dto/connect-pakasir.dto';
import { ConnectGoogleAnalyticsDto } from './dto/connect-google-analytics.dto';
import { IntegrationProvider } from '@prisma/client';
interface RequestWithUser {
    user: {
        id: string;
        email: string;
    };
}
export declare class IntegrationController {
    private readonly integrationService;
    constructor(integrationService: IntegrationService);
    findAll(req: RequestWithUser, businessId: string): Promise<any[]>;
    findOne(req: RequestWithUser, businessId: string, provider: IntegrationProvider): Promise<any>;
    disconnect(req: RequestWithUser, businessId: string, provider: IntegrationProvider): Promise<{
        success: boolean;
        message: string;
    }>;
    connectPakasir(req: RequestWithUser, businessId: string, dto: ConnectPakasirDto): Promise<any>;
    updatePakasir(req: RequestWithUser, businessId: string, dto: ConnectPakasirDto): Promise<any>;
    testPakasir(req: RequestWithUser, businessId: string, dto: ConnectPakasirDto): Promise<{
        success: boolean;
        message: string;
    }>;
    connectGoogleAnalytics(req: RequestWithUser, businessId: string, dto: ConnectGoogleAnalyticsDto): Promise<any>;
    updateGoogleAnalytics(req: RequestWithUser, businessId: string, dto: ConnectGoogleAnalyticsDto): Promise<any>;
    testGoogleAnalytics(req: RequestWithUser, businessId: string, dto: ConnectGoogleAnalyticsDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getInstagramConnect(req: RequestWithUser, businessId: string): Promise<{
        url: string;
    }>;
    instagramCallback(code: string, state: string, res: express.Response): Promise<void>;
    getThreadsConnect(req: RequestWithUser, businessId: string): Promise<{
        url: string;
    }>;
    threadsCallback(code: string, state: string, res: express.Response): Promise<void>;
}
export {};
