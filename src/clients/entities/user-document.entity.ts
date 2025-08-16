import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'user_documents' })
export class UserDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid') @Index() user_id: string;

  @Column({ type: 'char', length: 3, nullable: true }) doc_tab: string | null; // p.ej. 'DOC'
  @Column({ type: 'char', length: 3, nullable: true }) doc_cod: string | null; // '001' Selfie, etc.

  @Column({ type: 'text' }) storage_path: string;
  @Column({ type: 'text', nullable: true }) filename: string | null;
  @Column({ type: 'text', nullable: true }) mime_type: string | null;
  @Column({ type: 'int', nullable: true }) size_bytes: number | null;

  @Column({ type: 'text', nullable: true }) status: string | null;
  @Column({ type: 'text', nullable: true }) notes: string | null;

  @Column({ type: 'timestamptz', default: () => 'now()' }) uploaded_at: Date;
}
