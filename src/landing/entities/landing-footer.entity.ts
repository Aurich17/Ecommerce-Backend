import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'landing_footer' })
export class LandingFooter {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'text' }) contact_email: string;
  @Column({ type: 'text' }) contact_phone: string;

  @Column({ type: 'text' }) footer_title: string;
  @Column({ type: 'text' }) footer_desc: string;
  @Column({ type: 'text' }) footer_left_desc: string;
  @Column({ type: 'text' }) footer_copy: string;

  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updated_at: Date;
}
