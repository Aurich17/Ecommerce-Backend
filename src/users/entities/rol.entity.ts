import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'rol' })
export class Rol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', name: 'descripcion' })
  description: string;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  datecrea: Date;

  @Column({ type: 'text' })
  usercrea: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
