import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { Tipo } from '../catalogs/tipo.entity';
import { ClientProfile } from './entities/client-profile.entity';
import { UserDocument } from './entities/user-document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserRole,
      Tipo,
      ClientProfile,
      UserDocument,
    ]),
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
