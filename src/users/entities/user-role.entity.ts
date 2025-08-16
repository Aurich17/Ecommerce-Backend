import { Entity, PrimaryColumn, Index } from 'typeorm';

@Entity({ name: 'user_roles' })
@Index('ix_user_roles_rol', ['role_tab', 'role_cod', 'user_id'])
export class UserRole {
  @PrimaryColumn('uuid')
  user_id: string;

  @PrimaryColumn({ type: 'char', length: 3, default: 'ROL' })
  role_tab: string;

  @PrimaryColumn({ type: 'char', length: 3 })
  role_cod: string;
}
