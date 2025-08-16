import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'company_documents' })
export class CompanyDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid') @Index() user_id: string; // dueña = empresa (usuario)

  @Column({ type: 'char', length: 3, nullable: true }) doc_tab: string | null; // ej. 'DOC'
  @Column({ type: 'char', length: 3, nullable: true }) doc_cod: string | null; // '010' RUC, etc.

  @Column({ type: 'text' }) storage_path: string;
  @Column({ type: 'text', nullable: true }) filename: string | null;
  @Column({ type: 'text', nullable: true }) mime_type: string | null;
  @Column({ type: 'int', nullable: true }) size_bytes: number | null;

  @Column({ type: 'text', nullable: true }) status: string | null;
  @Column({ type: 'text', nullable: true }) notes: string | null;

  @Column({ type: 'timestamptz', default: () => 'now()' }) uploaded_at: Date;
}
