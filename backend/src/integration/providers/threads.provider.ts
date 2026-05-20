import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ThreadsProvider {
  private readonly THREADS_OAUTH_URL = 'https://threads.net/oauth/authorize';
  private readonly THREADS_API_URL = 'https://graph.threads.net/v1.0';

  getConnectUrl(businessId: string): string {
    const appId = process.env.THREADS_APP_ID || 'mock_threads_app_id';
    const backendUrl = process.env.BACKEND_URL
      ? process.env.BACKEND_URL.replace(/\/$/, '')
      : 'http://localhost:3001';
    const redirectUri =
      process.env.THREADS_REDIRECT_URI ||
      `${backendUrl}/api/v1/integrations/threads/callback`;
    const scope = 'threads_basic,threads_content_publish';

    const stateObj = { businessId, timestamp: Date.now() };
    const state = Buffer.from(JSON.stringify(stateObj)).toString('base64');

    return `${this.THREADS_OAUTH_URL}?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}&response_type=code`;
  }

  async exchangeCodeForToken(
    code: string,
  ): Promise<{ accessToken: string; expiresIn: number }> {
    const appId = process.env.THREADS_APP_ID;
    const appSecret = process.env.THREADS_APP_SECRET;
    const backendUrl = process.env.BACKEND_URL
      ? process.env.BACKEND_URL.replace(/\/$/, '')
      : 'http://localhost:3001';
    const redirectUri =
      process.env.THREADS_REDIRECT_URI ||
      `${backendUrl}/api/v1/integrations/threads/callback`;

    if (!appId || !appSecret) {
      return {
        accessToken: `th_access_token_mock_${Math.random().toString(36).substring(2, 15)}`,
        expiresIn: 2592000, // 30 days
      };
    }

    try {
      const url = `https://graph.threads.net/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData?.error_message || 'Threads OAuth exchange failed',
        );
      }
      const data = await response.json();
      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in || 2592000,
      };
    } catch (error) {
      throw new BadRequestException(
        `Threads token exchange failed: ${error.message}`,
      );
    }
  }

  async getAccountInfo(
    accessToken: string,
  ): Promise<{ accountId: string; accountName: string }> {
    if (accessToken.startsWith('th_access_token_mock')) {
      return {
        accountId: 'th_acc_id_987654321',
        accountName: 'threads_user_jago',
      };
    }

    try {
      const url = `${this.THREADS_API_URL}/me?fields=id,username&access_token=${accessToken}`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error('Failed to fetch Threads profile details');
      const data = await response.json();
      return {
        accountId: data.id,
        accountName: data.username || 'Threads Profile',
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve Threads account info: ${error.message}`,
      );
    }
  }

  async publish(
    accessToken: string,
    threadsAccountId: string,
    content: string,
    imageUrl?: string,
  ): Promise<string> {
    if (accessToken.startsWith('th_access_token_mock')) {
      return `th_post_${Math.random().toString(36).substring(2, 10)}`;
    }

    try {
      // Threads publishing is a 2-step process:
      // 1. Create a container (POST to /me/threads)
      const containerUrl = `${this.THREADS_API_URL}/me/threads`;
      const body: any = {
        media_type: imageUrl ? 'IMAGE' : 'TEXT',
        text: content,
        access_token: accessToken,
      };
      if (imageUrl) {
        body.image_url = imageUrl;
      }

      const containerRes = await fetch(containerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!containerRes.ok) {
        const err = await containerRes.json();
        throw new Error(
          err?.error?.message || 'Failed to create Threads container',
        );
      }
      const containerData = await containerRes.json();
      const creationId = containerData.id;

      // 2. Publish the container (POST to /me/threads_publish)
      const publishUrl = `${this.THREADS_API_URL}/me/threads_publish`;
      const publishRes = await fetch(publishUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: accessToken,
        }),
      });

      if (!publishRes.ok) {
        const err = await publishRes.json();
        throw new Error(
          err?.error?.message || 'Failed to publish Threads container',
        );
      }
      const publishData = await publishRes.json();
      return publishData.id;
    } catch (error) {
      throw new BadRequestException(`Threads posting failed: ${error.message}`);
    }
  }
}
