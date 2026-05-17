export declare class InstagramProvider {
    private readonly META_OAUTH_URL;
    private readonly GRAPH_API_URL;
    getConnectUrl(businessId: string): string;
    exchangeCodeForToken(code: string): Promise<{
        accessToken: string;
        expiresIn: number;
    }>;
    getAccountInfo(accessToken: string): Promise<{
        accountId: string;
        accountName: string;
    }>;
    publish(accessToken: string, instagramAccountId: string, caption: string, imageUrl: string): Promise<string>;
}
