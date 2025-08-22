// src/accesos/entities/acceso.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'acceso' })
@Unique(['idRol', 'idMenu']) // opcional, útil si cada rol-menú es único
export class Acceso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_rol', type: 'int' })
  idRol: number;

  @Column({ name: 'id_menu', type: 'int' })
  idMenu: number;

  @Column({ name: 'activo', type: 'bool', default: true })
  activo: boolean;

  @Column({ name: 'add_register', type: 'bool', default: false })
  addRegister: boolean;

  @Column({ name: 'edit_register', type: 'bool', default: false })
  editRegister: boolean;

  @Column({ name: 'delete_register', type: 'bool', default: false })
  deleteRegister: boolean;

  @Column({ name: 'usser_crea', type: 'text', nullable: true })
  usserCrea?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
