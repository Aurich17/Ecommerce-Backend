import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cliente } from '../clientes/cliente.entity';

@Entity({ name: 'ocupaciones' })
export class Ocupaciones {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  descripcion: string;

  @OneToMany(() => Cliente, (cliente) => cliente.ocupacion)
  clientes: Cliente[];
}
