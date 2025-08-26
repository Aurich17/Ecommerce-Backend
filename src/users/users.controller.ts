import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';

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
}
