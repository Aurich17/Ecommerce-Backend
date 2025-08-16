import { ApiProperty } from '@nestjs/swagger';

export class TipoRef {
  @ApiProperty({ example: 'ROL' }) tab!: string;
  @ApiProperty({ example: '003' }) cod!: string;
  @ApiProperty({ example: 'Cliente' }) desc!: string;
}

export class AccountStateRef {
  @ApiProperty({ example: 'EST' }) tab!: string;
  @ApiProperty({ example: '001' }) cod!: string;
  @ApiProperty({ example: 'PENDIENTE' }) desc!: string;
}

export class UserListItem {
  @ApiProperty() id!: string;
  @ApiProperty() fullName!: string;
  @ApiProperty() email!: string;
  @ApiProperty({ nullable: true }) phone?: string | null;
  @ApiProperty() socialSecurity!: string;
  @ApiProperty() status!: string;
  @ApiProperty({ type: [TipoRef] }) roles!: TipoRef[];
  @ApiProperty({ type: AccountStateRef }) accountState!: AccountStateRef;
  @ApiProperty() createdAt!: string;
}

export class UsersListResponse {
  @ApiProperty({ example: true }) success!: true;
  @ApiProperty({
    example: { items: [], total: 0, page: 1, limit: 20 },
  })
  data!: { items: UserListItem[]; total: number; page: number; limit: number };
}

export class UserDetailResponse {
  @ApiProperty({ example: true }) success!: true;
  @ApiProperty({ type: UserListItem }) data!: UserListItem;
}
