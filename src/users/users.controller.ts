import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { PatchUserStatusDto } from './dto/patch-user-status.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  // GET /users - Lista usuarios con nombre, status y rol
  @Get()
  async listUsers() {
    const data = await this.service.listUsers();
    return { success: true, data };
  }

  // GET /users/:id/documents?type=cliente|empresa
  @Get(':id/documents')
  async getUserDocuments(
    @Param('id') userId: string,
    @Query('type') userType: 'cliente' | 'empresa',
  ) {
    const data = await this.service.getUserDocuments(userId, userType);
    return { success: true, data };
  }

  @Get(':id/summary')
  async getUserSummary(@Param('id') userId: string) {
    const data = await this.service.getUserSummary(userId);
    return { success: true, data };
  }

  @Patch(':id/status')
  async patchStatus(
    @Param('id') userId: string, // UUID
    @Body() dto: PatchUserStatusDto,
  ) {
    const data = await this.service.updateUserStatus(userId, dto.status);
    return { success: true, data };
  }
}
