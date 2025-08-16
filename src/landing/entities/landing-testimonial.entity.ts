import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'landing_testimonials' })
export class LandingTestimonial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' }) comment: string;

  @Column({ type: 'uuid', nullable: true }) user_id: string | null;

  @Column({ type: 'text', nullable: true }) client_name: string | null;
  @Column({ type: 'text', nullable: true }) occupation_text: string | null;

  @Column({ type: 'char', length: 3, default: 'OCU' }) occupation_tab: string;
  @Column({ type: 'char', length: 3, nullable: true }) occupation_cod:
    | string
    | null;

  @Index()
  @Column({ type: 'boolean', default: true })
  enabled: boolean;

  @Column({ type: 'timestamptz', default: () => 'now()' }) created_at: Date;
  @Column({ type: 'timestamptz', default: () => 'now()' }) updated_at: Date;
}
