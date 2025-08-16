import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'company_profiles' })
export class CompanyProfile {
  @PrimaryColumn('uuid')
  user_id: string; // usuario representante (1:1)

  @Column({ type: 'text' }) company_name: string;

  @Column({ type: 'char', length: 3, default: 'NEG' })
  business_type_tab: string;
  @Column({ type: 'char', length: 3, nullable: true }) business_type_cod:
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

  @Column({ type: 'date', nullable: true }) founded_on: string | null;
  @Column({ type: 'int', nullable: true }) employee_count: number | null;

  // Extras opcionales de ubicación/contacto
  @Column({ type: 'text', nullable: true }) fiscal_address: string | null;
  @Column({ type: 'text', nullable: true }) city: string | null;
  @Column({ type: 'text', nullable: true }) postal_code: string | null;
  @Column({ type: 'text', nullable: true }) website: string | null;

  @Column({ type: 'timestamptz', default: () => 'now()' }) created_at: Date;
  @Column({ type: 'timestamptz', default: () => 'now()' }) updated_at: Date;
}
