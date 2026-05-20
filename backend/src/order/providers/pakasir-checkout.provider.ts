import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PakasirCheckoutProvider {
  private readonly logger = new Logger(PakasirCheckoutProvider.name);

  /**
   * Generates a secure redirect checkout URL for Pakasir payment
   */
  generateCheckoutUrl(
    projectSlug: string,
    amount: number,
    orderId: string,
    redirectUrl?: string,
  ): string {
    const baseUrl = `https://app.pakasir.com/pay/${projectSlug}/${amount}`;
    const params = new URLSearchParams({
      order_id: orderId,
      qris_only: '1',
    });

    if (redirectUrl) {
      params.append('redirect', redirectUrl);
    }

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Verifies the status of a Pakasir transaction using the GET detail API
   */
  async verifyTransaction(
    projectSlug: string,
    amount: number,
    orderId: string,
    apiKey: string,
  ): Promise<{ status: string; method?: string; completedAt?: string } | null> {
    try {
      const response = await axios.get(
        `https://app.pakasir.com/api/transactiondetail`,
        {
          params: {
            project: projectSlug,
            amount: amount,
            order_id: orderId,
            api_key: apiKey,
          },
        },
      );

      if (response.data) {
        this.logger.log(
          `Verified Pakasir transaction ${orderId}: status=${response.data.status}`,
        );
        return {
          status: response.data.status, // e.g. 'completed', 'pending'
          method: response.data.payment_method,
          completedAt: response.data.completed_at,
        };
      }
      return null;
    } catch (error) {
      this.logger.error(
        `Error verifying Pakasir transaction ${orderId}: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }
}
