export declare class ThreadsProvider {
    private readonly THREADS_OAUTH_URL;
    private readonly THREADS_API_URL;
    getConnectUrl(businessId: string): string;
    exchangeCodeForToken(code: string): Promise<{
        accessToken: string;
        expiresIn: number;
    }>;
    getAccountInfo(accessToken: string): Promise<{
        accountId: string;
        accountName: string;
    }>;
    publish(accessToken: string, threadsAccountId: string, content: string, imageUrl?: string): Promise<string>;
}
