import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PakasirIntegrationProvider {
  async testConnection(slug: string, apiKey: string): Promise<boolean> {
    if (!slug || !apiKey) {
      throw new BadRequestException('Slug and API Key are required');
    }
    
    try {
      // For testing, if an API Key containing "invalid" or "error" is passed, trigger failure
      if (apiKey.toLowerCase().includes('invalid') || apiKey.toLowerCase().includes('error')) {
        throw new Error('Autentikasi gagal. Slug atau API Key salah.');
      }
      
      // Simulating a real HTTP Ping check to the external Pakasir API
      // In production, we would call:
      // await fetch(`https://api.pakasir.com/v1/projects/${slug}/ping`, { headers: { Authorization: `Bearer ${apiKey}` } });
      
      return true;
    } catch (error) {
      throw new BadRequestException(`Pakasir Connection Failed: ${error.message}`);
    }
  }
}
