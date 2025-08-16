import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'landing_audiences' })
export class LandingAudience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' }) icon: string;
  @Column({ type: 'text' }) entity: string;
  @Column({ type: 'text' }) description: string;

  @Index()
  @Column({ type: 'int', default: 0 })
  position: number;

  @Index()
  @Column({ type: 'boolean', default: true })
  enabled: boolean;

  @Column({ type: 'timestamptz', default: () => 'now()' }) created_at: Date;
  @Column({ type: 'timestamptz', default: () => 'now()' }) updated_at: Date;
}
