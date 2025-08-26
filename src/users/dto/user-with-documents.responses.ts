import { ApiProperty } from '@nestjs/swagger';

export class DocumentInfo {
  @ApiProperty() id!: string;
  @ApiProperty({ nullable: true }) doc_tab!: string | null;
  @ApiProperty({ nullable: true }) doc_cod!: string | null;
  @ApiProperty() storage_path!: string;
  @ApiProperty({ nullable: true }) filename!: string | null;
  @ApiProperty() uploaded_at!: Date;
}

export class RoleInfo {
  @ApiProperty() tab!: string;
  @ApiProperty() cod!: string;
  @ApiProperty() desc!: string;
}

export class UserWithDocuments {
  @ApiProperty() id!: string;
  @ApiProperty() fullName!: string;
  @ApiProperty() status!: string;
  @ApiProperty() role!: string; // "empresa" o "cliente"
  @ApiProperty({ type: [DocumentInfo] }) documents!: DocumentInfo[];
  @ApiProperty({ type: [RoleInfo] }) roles!: RoleInfo[];
  @ApiProperty() createdAt!: Date;
}

export class UsersWithDocumentsResponse {
  @ApiProperty({ example: true }) success!: true;
  @ApiProperty({
    example: { items: [], total: 0, page: 1, limit: 20 },
  })
  data!: {
    items: UserWithDocuments[];
    total: number;
    page: number;
    limit: number;
  };
}
