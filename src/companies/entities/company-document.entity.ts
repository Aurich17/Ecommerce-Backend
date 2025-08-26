import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'company_documents' })
export class CompanyDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  user_id: string;

  // Solo la columna que realmente existe
  @Column({ type: 'text', nullable: true })
  doc_url: string | null;
}
