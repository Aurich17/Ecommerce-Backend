import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'landing_faq' })
export class LandingFaq {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'text' }) @Index() pregunta: string;
  @Column({ type: 'text' }) respuesta: string;

  @Column({ type: 'int', default: 0 }) @Index() orden: number;
  @Column({ type: 'boolean', default: true }) @Index() activo: boolean;

  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updated_at: Date;
}
