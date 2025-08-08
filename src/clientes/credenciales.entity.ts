import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Cliente } from './cliente.entity';

@Entity({ name: 'credenciales' })
export class Credenciales {
  @PrimaryColumn({ name: 'cliente_id' })
  clienteId: number;

  @OneToOne(() => Cliente, (cliente) => cliente.credenciales)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'text' })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
