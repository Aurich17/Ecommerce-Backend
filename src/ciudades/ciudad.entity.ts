// src/paises/pais.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Provincia } from '../provincias/provincia.entity';

@Entity({ name: 'paises' })
export class Ciudad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  nombre: string;

  @OneToMany(() => Provincia, (provincia) => provincia.pais)
  provincias: Provincia[];
}
