import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'landing_caracteristicas' })
export class LandingFeature {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'text' }) icono: string; // ej: 'lock-keyhole'
  @Column({ type: 'text' }) @Index() titulo: string;
  @Column({ type: 'text' }) descripcion: string;

  @Column({ type: 'int', default: 0 }) @Index() orden: number;
  @Column({ type: 'boolean', default: true }) @Index() activo: boolean;

  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updated_at: Date;
}
