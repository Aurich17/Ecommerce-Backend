// clients/entities/user-document.entity.ts
import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'cliente_documentos' })
export class UserDocument {
  @PrimaryColumn('uuid', { name: 'user_id' })
  user_id!: string; // <- FK al users.id

  @Column('text', { name: 'selfie_url', nullable: true })
  selfie_url!: string | null;

  @Column('text', { name: 'dni_reverso_url', nullable: true })
  dni_reverso_url!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at!: Date;
}
