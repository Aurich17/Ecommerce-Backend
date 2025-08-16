import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'citext', unique: true })
  @Index()
  email: string;

  @Column({ type: 'text' })
  password_hash: string;

  @Column({ type: 'text' })
  @Index()
  full_name: string;

  @Column({ type: 'text', nullable: true })
  phone_e164: string | null;

  @Column({ type: 'varchar', length: 12, unique: true })
  @Index()
  social_security_code: string;

  // Estado técnico (habilitado/deshabilitado) – libre
  @Column({ type: 'text', default: 'habilitado' })
  status: string;

  // Estado de cuenta (EST)
  @Column({ type: 'char', length: 3, default: 'EST' })
  account_state_tab: string;

  @Column({ type: 'char', length: 3, default: '001' })
  account_state_cod: string;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  updated_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  last_login_at: Date | null;

  @Column({ type: 'inet', nullable: true })
  last_login_ip: string | null;
}
