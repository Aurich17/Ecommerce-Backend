import { ApiProperty } from '@nestjs/swagger';

class TipoRefResp {
  @ApiProperty() tab!: string;
  @ApiProperty() cod!: string;
  @ApiProperty() desc!: string;
}
class AccountStateResp {
  @ApiProperty() tab!: string;
  @ApiProperty() cod!: string;
  @ApiProperty() desc!: string;
}
class DocumentResp {
  @ApiProperty() id!: string;
  @ApiProperty() tab!: string | null;
  @ApiProperty() cod!: string | null;
  @ApiProperty() storagePath!: string;
}

export class ClientDetailResp {
  @ApiProperty() userId!: string;
  @ApiProperty() fullName!: string;
  @ApiProperty() email!: string;
  @ApiProperty() phone!: string | null;
  @ApiProperty() socialSecurity!: string;
  @ApiProperty({ type: AccountStateResp }) accountState!: AccountStateResp;
  @ApiProperty({ type: [TipoRefResp] }) roles!: TipoRefResp[];

  @ApiProperty() firstName!: string;
  @ApiProperty() lastName!: string;
  @ApiProperty({ nullable: true }) address!: string | null;
  @ApiProperty({ nullable: true }) birthDate!: string | null;

  @ApiProperty({ nullable: true, type: TipoRefResp })
  gender?: TipoRefResp | null;
  @ApiProperty({ nullable: true, type: TipoRefResp })
  occupation?: TipoRefResp | null;
  @ApiProperty({ nullable: true, type: TipoRefResp })
  country?: TipoRefResp | null;
  @ApiProperty({ nullable: true, type: TipoRefResp })
  province?: TipoRefResp | null;
  @ApiProperty({ nullable: true, type: TipoRefResp })
  municipality?: TipoRefResp | null;

  @ApiProperty({ nullable: true }) altContactName!: string | null;
  @ApiProperty({ nullable: true }) altContactPhone!: string | null;

  @ApiProperty({ type: [DocumentResp] }) documents!: DocumentResp[];
}

export class OkClientResponse {
  @ApiProperty({ example: true }) success!: true;
  @ApiProperty({ type: ClientDetailResp }) data!: ClientDetailResp;
}
