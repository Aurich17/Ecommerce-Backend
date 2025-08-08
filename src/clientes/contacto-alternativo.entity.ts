import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Cliente } from './cliente.entity';

@Entity({ name: 'contacto_alternativo' })
export class ContactoAlternativo {
  @PrimaryColumn({ name: 'cliente_id' })
  clienteId: number;

  @OneToOne(() => Cliente, (cliente) => cliente.contactoAlternativo)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column({ type: 'text' })
  nombre: string;

  @Column({ type: 'text' })
  telefono: string;
}
