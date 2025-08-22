// landing-encabezado.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('landing_encabezado')
export class LandingEncabezado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  titulo_principal?: string;

  @Column({ nullable: true })
  subtitulo?: string;

  @Column({ nullable: true })
  parrafo_encabezado?: string;

  @Column({ nullable: true })
  titulo_marketplace?: string;

  @Column({ nullable: true })
  subtitulo_marketplace?: string;

  @Column({ nullable: true, type: 'text' })
  nota?: string | null;

  // 👇 NUEVOS CAMPOS
  @Column({ name: 'logo_url', nullable: true })
  logoUrl?: string;

  @Column({ name: 'logo_name', nullable: true })
  logoName?: string;
}
