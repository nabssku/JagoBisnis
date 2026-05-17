import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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

@ApiTags('integrations')
@Controller()
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  // --- CRUD Integrations ---

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('businesses/:businessId/integrations')
  @ApiOperation({ summary: 'Get all connected integrations for a business' })
  findAll(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
  ) {
    return this.integrationService.findAll(req.user.id, businessId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('businesses/:businessId/integrations/:provider')
  @ApiOperation({ summary: 'Get detailed integration configuration for a provider' })
  findOne(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Param('provider') provider: IntegrationProvider,
  ) {
    return this.integrationService.findOne(req.user.id, businessId, provider);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('businesses/:businessId/integrations/:provider')
  @ApiOperation({ summary: 'Disconnect an integration provider' })
  disconnect(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Param('provider') provider: IntegrationProvider,
  ) {
    return this.integrationService.disconnect(req.user.id, businessId, provider);
  }

  // --- Pakasir Configuration ---

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('businesses/:businessId/integrations/pakasir')
  @ApiOperation({ summary: 'Connect Pakasir integration' })
  connectPakasir(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Body() dto: ConnectPakasirDto,
  ) {
    return this.integrationService.connectPakasir(req.user.id, businessId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('businesses/:businessId/integrations/pakasir')
  @ApiOperation({ summary: 'Update Pakasir integration' })
  updatePakasir(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Body() dto: ConnectPakasirDto,
  ) {
    return this.integrationService.connectPakasir(req.user.id, businessId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('businesses/:businessId/integrations/pakasir/test')
  @ApiOperation({ summary: 'Test connection to Pakasir service' })
  testPakasir(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Body() dto: ConnectPakasirDto,
  ) {
    return this.integrationService.testPakasir(req.user.id, businessId, dto);
  }

  // --- Google Analytics Configuration ---

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('businesses/:businessId/integrations/google-analytics')
  @ApiOperation({ summary: 'Connect Google Analytics integration' })
  connectGoogleAnalytics(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Body() dto: ConnectGoogleAnalyticsDto,
  ) {
    return this.integrationService.connectGoogleAnalytics(req.user.id, businessId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('businesses/:businessId/integrations/google-analytics')
  @ApiOperation({ summary: 'Update Google Analytics integration' })
  updateGoogleAnalytics(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Body() dto: ConnectGoogleAnalyticsDto,
  ) {
    return this.integrationService.connectGoogleAnalytics(req.user.id, businessId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('businesses/:businessId/integrations/google-analytics/test')
  @ApiOperation({ summary: 'Test connection to Google Analytics endpoint' })
  testGoogleAnalytics(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
    @Body() dto: ConnectGoogleAnalyticsDto,
  ) {
    return this.integrationService.testGoogleAnalytics(req.user.id, businessId, dto);
  }

  // --- Instagram OAuth Flow ---

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('businesses/:businessId/integrations/instagram/connect')
  @ApiOperation({ summary: 'Get Meta OAuth URL for Instagram' })
  getInstagramConnect(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
  ) {
    return this.integrationService.getInstagramConnectUrl(req.user.id, businessId);
  }

  @Get('integrations/instagram/callback')
  @ApiOperation({ summary: 'Meta OAuth callback for Instagram' })
  async instagramCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: express.Response,
  ) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    try {
      const { businessId } = await this.integrationService.handleInstagramCallback(code, state);
      return res.redirect(
        `${frontendUrl}/dashboard/business/${businessId}/integrations?provider=instagram&status=success`,
      );
    } catch (error) {
      return res.redirect(
        `${frontendUrl}/dashboard?status=error&message=${encodeURIComponent(error.message)}`,
      );
    }
  }

  // --- Threads OAuth Flow ---

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('businesses/:businessId/integrations/threads/connect')
  @ApiOperation({ summary: 'Get Threads OAuth URL' })
  getThreadsConnect(
    @Request() req: RequestWithUser,
    @Param('businessId') businessId: string,
  ) {
    return this.integrationService.getThreadsConnectUrl(req.user.id, businessId);
  }

  @Get('integrations/threads/callback')
  @ApiOperation({ summary: 'Threads OAuth callback' })
  async threadsCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: express.Response,
  ) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    try {
      const { businessId } = await this.integrationService.handleThreadsCallback(code, state);
      return res.redirect(
        `${frontendUrl}/dashboard/business/${businessId}/integrations?provider=threads&status=success`,
      );
    } catch (error) {
      return res.redirect(
        `${frontendUrl}/dashboard?status=error&message=${encodeURIComponent(error.message)}`,
      );
    }
  }
}
