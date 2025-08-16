import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'client_profiles' })
export class ClientProfile {
  @PrimaryColumn('uuid')
  user_id: string;

  @Column({ type: 'text' }) first_name: string;
  @Column({ type: 'text' }) last_name: string;
  @Column({ type: 'text', nullable: true }) address: string | null;
  @Column({ type: 'date', nullable: true }) birth_date: string | null;

  @Column({ type: 'char', length: 3, default: 'GEN' }) gender_tab: string;
  @Column({ type: 'char', length: 3, nullable: true }) gender_cod:
    | string
    | null;

  @Column({ type: 'char', length: 3, default: 'OCU' }) occupation_tab: string;
  @Column({ type: 'char', length: 3, nullable: true }) occupation_cod:
    | string
    | null;

  @Column({ type: 'char', length: 3, default: 'PAI' }) country_tab: string;
  @Column({ type: 'char', length: 3, nullable: true }) country_cod:
    | string
    | null;

  @Column({ type: 'char', length: 3, default: 'REG' }) province_tab: string;
  @Column({ type: 'char', length: 3, nullable: true }) province_cod:
    | string
    | null;

  @Column({ type: 'char', length: 3, default: 'MUN' }) municipality_tab: string;
  @Column({ type: 'char', length: 3, nullable: true }) municipality_cod:
    | string
    | null;

  @Column({ type: 'text', nullable: true }) alt_contact_name: string | null;
  @Column({ type: 'text', nullable: true }) alt_contact_phone_e164:
    | string
    | null;

  @Column({ type: 'timestamptz', default: () => 'now()' }) created_at: Date;
  @Column({ type: 'timestamptz', default: () => 'now()' }) updated_at: Date;
}
