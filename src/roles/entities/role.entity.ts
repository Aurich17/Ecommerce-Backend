// src/roles/entities/role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'rol' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({
    name: 'datecrea',
    type: 'date',
    nullable: true,
    default: () => 'CURRENT_DATE',
  })
  datecrea?: string;

  // En la BD se llama ussercrea (con doble s)
  @Column({ name: 'ussercrea', type: 'text', nullable: true })
  usercrea?: string;

  // En la BD se llama activo (no active)
  @Column({ name: 'activo', type: 'bool', default: true })
  activo: boolean;
}
