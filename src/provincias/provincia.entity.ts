import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Pais } from '../paises/pais.entity';
import { Ciudad } from '../ciudades/ciudad.entity';

@Entity({ name: 'provincias' })
export class Provincia {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pais, (pais) => pais.provincias)
  @JoinColumn({ name: 'pais_id' })
  pais: Pais;

  @Column({ name: 'pais_id' })
  paisId: number;

  @Column({ type: 'text' })
  nombre: string;

  @OneToMany(() => Ciudad, (ciudad) => ciudad.provincia)
  ciudades: Ciudad[];
}
