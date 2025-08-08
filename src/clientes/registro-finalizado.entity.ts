import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Cliente } from './cliente.entity';

@Entity({ name: 'registro_finalizado' })
export class RegistroFinalizado {
  @PrimaryColumn({ name: 'cliente_id' })
  clienteId: number;

  @OneToOne(() => Cliente, (cliente) => cliente.registroFinalizado)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column({ name: 'social_security', type: 'text', unique: true })
  socialSecurity: string;

  @CreateDateColumn({ name: 'finalized_at', type: 'timestamptz' })
  finalizedAt: Date;
}
