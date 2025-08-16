import { Entity, PrimaryGeneratedColumn, Column, Unique, Index } from 'typeorm';

@Entity({ name: 'e_tipos' })
@Unique('uq_tipos_tab_cod', ['tab_tabla', 'cod_tipo'])
export class Tipo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'char', length: 3 })
  @Index()
  tab_tabla: string;

  @Column({ type: 'text' })
  des_tipo: string;

  @Column({ type: 'char', length: 3 })
  cod_tipo: string;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  created_at: Date;
}
