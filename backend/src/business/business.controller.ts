import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

interface RequestWithUser {
  user: {
    id: string;
    email: string;
  };
}

@ApiTags('businesses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('businesses')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new business' })
  @ApiResponse({ status: 201, description: 'Business successfully created' })
  create(@Request() req: RequestWithUser, @Body() dto: CreateBusinessDto) {
    return this.businessService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all businesses for the current user' })
  findAll(@Request() req: RequestWithUser) {
    return this.businessService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get business by ID' })
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.businessService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update business profile' })
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateBusinessDto,
  ) {
    return this.businessService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete business' })
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.businessService.remove(req.user.id, id);
  }
}
