import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'imagenes_cabecera' })
export class LandingSlider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'text', name: 'name_file' })
  name_file: string;

  @Index()
  @Column({ type: 'boolean', name: 'status', default: true })
  status: boolean;
}
