import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-role.entity';
import { Tipo } from '../catalogs/tipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole, Tipo])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
