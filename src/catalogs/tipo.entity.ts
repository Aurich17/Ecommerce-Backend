import { Entity, PrimaryGeneratedColumn, Column, Unique, Index } from 'typeorm';

@Entity({ name: 'e_tipos' })
@Unique('uq_tipos_tab_cod', ['tab_tabla', 'cod_tipo'])
export class Tipo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string; // BIGSERIAL

  @Column({ type: 'char', length: 3 })
  @Index()
  tab_tabla: string; // 'ROL','PAI','REG','MUN','GEN','OCU','NEG','MON','EST','REQ','SOL','DOC'

  @Column({ type: 'text' })
  des_tipo: string;

  @Column({ type: 'char', length: 3 })
  cod_tipo: string; // '001'..'999'

  @Column({ type: 'timestamptz', default: () => 'now()' })
  created_at: Date;
}
