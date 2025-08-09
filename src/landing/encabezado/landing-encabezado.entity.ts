import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'landing_encabezado' })
export class LandingEncabezado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  titulo_principal: string;

  @Column({ type: 'text' })
  subtitulo: string;

  @Column({ type: 'text' })
  parrafo_encabezado: string;

  @Column({ type: 'text' })
  titulo_marketplace: string;

  @Column({ type: 'text' })
  subtitulo_marketplace: string;

  @Column({ type: 'text', nullable: true })
  nota: string | null;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
