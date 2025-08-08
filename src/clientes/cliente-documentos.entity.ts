import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Cliente } from './cliente.entity';

@Entity({ name: 'cliente_documentos' })
export class ClienteDocumentos {
  @PrimaryColumn({ name: 'cliente_id' })
  clienteId: number;

  @OneToOne(() => Cliente, (cliente) => cliente.documentos)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column({ name: 'selfie_url', type: 'text' })
  selfieUrl: string;

  @Column({ name: 'dni_reverso_url', type: 'text' })
  dniReversoUrl: string;
}
