import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';
import { LogEventDto } from './dto/log-event.dto';

@ApiTags('Analytics')
@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('analytics/:businessId/log')
  @ApiOperation({ summary: 'Log a new analytics visitor event' })
  logEvent(
    @Param('businessId') businessId: string,
    @Body() dto: LogEventDto,
    @Request() req: any,
  ) {
    // Get client IP, checking for proxy forwarding headers typical of Vercel/Cloudflare
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    if (typeof ip === 'string' && ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    } else if (Array.isArray(ip)) {
      ip = ip[0];
    }
    const userAgent = req.headers['user-agent'] || '';
    return this.analyticsService.logEvent(businessId, ip as string, userAgent, dto);
  }

  @Get('businesses/:businessId/analytics/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get business analytics statistics' })
  getStats(
    @Param('businessId') businessId: string,
    @Query('range') range?: string,
  ) {
    const rangeDays = range ? parseInt(range, 10) : 30;
    return this.analyticsService.getStats(businessId, rangeDays);
  }
}
