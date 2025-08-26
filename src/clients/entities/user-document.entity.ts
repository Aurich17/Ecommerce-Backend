import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'cliente_documentos' })
export class UserDocument {
  @PrimaryGeneratedColumn()
  cliente_id: number;

  @Column({ type: 'text' })
  selfie_url: string;

  @Column({ type: 'text' })
  dni_reverso_url: string;
}
