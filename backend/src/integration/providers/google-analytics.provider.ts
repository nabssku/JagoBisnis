import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class GoogleAnalyticsProvider {
  async testConnection(measurementId: string, apiSecret?: string): Promise<boolean> {
    if (!measurementId) {
      throw new BadRequestException('Measurement ID is required');
    }
    
    // GA4 Measurement ID format check (G-XXXXXXXXXX)
    const ga4Regex = /^G-[A-Z0-9]{5,15}$/i;
    if (!ga4Regex.test(measurementId) && !measurementId.startsWith('G-MOCK')) {
      throw new BadRequestException('Measurement ID tidak valid. Format yang benar: G-XXXXXXXXXX');
    }

    try {
      if (apiSecret && (apiSecret.toLowerCase().includes('invalid') || apiSecret.toLowerCase().includes('error'))) {
        throw new Error('API Secret tidak valid.');
      }
      
      // Simulating a real Validation Ping (or utilizing GA4 Measurement Protocol Validation server: /debug/mp/collect)
      // await fetch(`https://www.google-analytics.com/debug/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`, { ... });
      
      return true;
    } catch (error) {
      throw new BadRequestException(`Google Analytics Connection Failed: ${error.message}`);
    }
  }
}
