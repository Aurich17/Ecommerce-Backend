// src/ciudades/ciudad.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { Provincia } from '../provincias/provincia.entity';

@Entity({ name: 'ciudades' })
export class Ciudad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  nombre: string;

  // FK explícita a provincias.id (columna provincia_id)
  @Index()
  @Column({ name: 'provincia_id', type: 'int' })
  provinciaId: number;

  @ManyToOne(() => Provincia, (provincia) => provincia.ciudades, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'provincia_id' }) // ← importantísimo para enlazar con la columna
  provincia: Provincia;
}
