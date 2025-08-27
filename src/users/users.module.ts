import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Rol } from './entities/rol.entity';

// 👇 importa las entidades del “mundo cliente/empresa”
import { ClientProfile } from '../clients/entities/client-profile.entity';
import { UserDocument } from '../clients/entities/user-document.entity';
import { CompanyDocument } from '../companies/entities/company-document.entity';
import { Tipo } from './entities/tipo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Rol,
      Tipo,
      ClientProfile, // <- necesario para mapear user_id(uuid) -> cliente_id(int)
      UserDocument, // <- documentos de cliente (cliente_id, selfie_url, dni_reverso_url)
      CompanyDocument, // <- documentos de empresa (user_id, doc_url)
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
