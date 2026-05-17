export declare class PakasirCheckoutProvider {
    private readonly logger;
    generateCheckoutUrl(projectSlug: string, amount: number, orderId: string, redirectUrl?: string): string;
    verifyTransaction(projectSlug: string, amount: number, orderId: string, apiKey: string): Promise<{
        status: string;
        method?: string;
        completedAt?: string;
    } | null>;
}
