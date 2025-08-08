import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cliente } from '../clientes/cliente.entity';

@Entity({ name: 'generos' })
export class Genero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  descripcion: string;

  @OneToMany(() => Cliente, (cliente) => cliente.genero)
  clientes: Cliente[];
}
