import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Rol } from './entities/rol.entity';
import { UserDocument } from '../clients/entities/user-document.entity';
import { CompanyDocument } from '../companies/entities/company-document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Rol, UserDocument, CompanyDocument]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
