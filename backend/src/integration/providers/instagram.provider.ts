import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class InstagramProvider {
  private readonly META_OAUTH_URL =
    'https://www.facebook.com/v19.0/dialog/oauth';
  private readonly GRAPH_API_URL = 'https://graph.facebook.com/v19.0';

  getConnectUrl(businessId: string): string {
    const appId = process.env.META_APP_ID || 'mock_meta_app_id';
    const backendUrl = process.env.BACKEND_URL
      ? process.env.BACKEND_URL.replace(/\/$/, '')
      : 'http://localhost:3001';
    const redirectUri =
      process.env.META_REDIRECT_URI_INSTAGRAM ||
      `${backendUrl}/api/v1/integrations/instagram/callback`;
    const scope =
      'instagram_basic,instagram_content_publish,pages_read_engagement,pages_show_list';

    // We package the businessId into OAuth state to keep trace of the business after callback redirection
    const stateObj = { businessId, timestamp: Date.now() };
    const state = Buffer.from(JSON.stringify(stateObj)).toString('base64');

    return `${this.META_OAUTH_URL}?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}&response_type=code`;
  }

  async exchangeCodeForToken(
    code: string,
  ): Promise<{ accessToken: string; expiresIn: number }> {
    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    const backendUrl = process.env.BACKEND_URL
      ? process.env.BACKEND_URL.replace(/\/$/, '')
      : 'http://localhost:3001';
    const redirectUri =
      process.env.META_REDIRECT_URI_INSTAGRAM ||
      `${backendUrl}/api/v1/integrations/instagram/callback`;

    if (!appId || !appSecret) {
      // Return fully operational mock credentials for local development if Meta credentials are not configured in .env
      return {
        accessToken: `ig_access_token_mock_${Math.random().toString(36).substring(2, 15)}`,
        expiresIn: 5184000, // 60 days
      };
    }

    try {
      const url = `${this.GRAPH_API_URL}/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData?.error?.message || 'Meta OAuth token exchange failed',
        );
      }
      const data = await response.json();
      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in || 5184000,
      };
    } catch (error) {
      throw new BadRequestException(
        `Instagram OAuth token exchange failed: ${error.message}`,
      );
    }
  }

  async getAccountInfo(
    accessToken: string,
  ): Promise<{ accountId: string; accountName: string }> {
    if (accessToken.startsWith('ig_access_token_mock')) {
      return {
        accountId: '17841401234567890',
        accountName: 'jagobisnis.outlet',
      };
    }

    try {
      // 1. Get user's managed Facebook Pages
      const pagesUrl = `${this.GRAPH_API_URL}/me/accounts?access_token=${accessToken}`;
      const pagesRes = await fetch(pagesUrl);
      if (!pagesRes.ok)
        throw new Error('Failed to fetch Facebook Pages listing');
      const pagesData = await pagesRes.json();

      const page = pagesData?.data?.[0];
      if (!page) {
        throw new Error(
          'No Facebook Page connected to this profile. Instagram professional account requires a connected Facebook page.',
        );
      }

      // 2. Fetch the Instagram Professional Account linked to the Facebook Page
      const igUrl = `${this.GRAPH_API_URL}/${page.id}?fields=instagram_business_account&access_token=${accessToken}`;
      const igRes = await fetch(igUrl);
      if (!igRes.ok)
        throw new Error('Failed to fetch Instagram account details');
      const igData = await igRes.json();

      const igId = igData?.instagram_business_account?.id;
      if (!igId) {
        throw new Error(
          'No Instagram Business Account linked to this Facebook page.',
        );
      }

      // 3. Get Instagram account username info
      const infoUrl = `${this.GRAPH_API_URL}/${igId}?fields=username&access_token=${accessToken}`;
      const infoRes = await fetch(infoUrl);
      if (!infoRes.ok)
        throw new Error('Failed to fetch Instagram username details');
      const infoData = await infoRes.json();

      return {
        accountId: igId,
        accountName: infoData?.username || 'Instagram Account',
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve Instagram account details: ${error.message}`,
      );
    }
  }

  async publish(
    accessToken: string,
    instagramAccountId: string,
    caption: string,
    imageUrl: string,
  ): Promise<string> {
    if (accessToken.startsWith('ig_access_token_mock')) {
      return `ig_post_${Math.random().toString(36).substring(2, 10)}`;
    }

    try {
      // Instagram publishing is a 2-step process:
      // 1. Create a media container (POST to /ig_user_id/media)
      const containerUrl = `${this.GRAPH_API_URL}/${instagramAccountId}/media`;
      const containerRes = await fetch(containerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption,
          access_token: accessToken,
        }),
      });

      if (!containerRes.ok) {
        const containerErr = await containerRes.json();
        throw new Error(
          containerErr?.error?.message || 'Failed to create media container',
        );
      }

      const containerData = await containerRes.json();
      const creationId = containerData.id;

      // 2. Publish the container (POST to /ig_user_id/media_publish)
      const publishUrl = `${this.GRAPH_API_URL}/${instagramAccountId}/media_publish`;
      const publishRes = await fetch(publishUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: accessToken,
        }),
      });

      if (!publishRes.ok) {
        const publishErr = await publishRes.json();
        throw new Error(
          publishErr?.error?.message || 'Failed to publish media container',
        );
      }

      const publishData = await publishRes.json();
      return publishData.id;
    } catch (error) {
      throw new BadRequestException(
        `Instagram publishing failed: ${error.message}`,
      );
    }
  }
}
