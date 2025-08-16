import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'requests' })
export class RequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  requester_user_id: string | null; // quién envía

  @Column({ type: 'uuid', nullable: true })
  @Index()
  subject_user_id: string | null; // sujeto (si aplica)

  @Column({ type: 'text' })
  subject_name: string; // snapshot para grilla

  // Tipo (REQ)
  @Column({ type: 'char', length: 3, default: 'REQ' })
  req_tab: string;

  @Column({ type: 'char', length: 3 })
  req_cod: string; // '001' empresa, '002' usuario, ...

  // Estado (EST)
  @Column({ type: 'char', length: 3, default: 'EST' })
  status_tab: string;

  @Column({ type: 'char', length: 3, default: '001' })
  status_cod: string; // 001 Pendiente, 002 Aprobado, 003 Rechazado

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  created_at: Date;

  @Column({ type: 'uuid', nullable: true })
  reviewed_by: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  reviewed_at: Date | null;

  @Column({ type: 'text', nullable: true })
  review_notes: string | null;
}
