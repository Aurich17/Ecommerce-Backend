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

export class CompanyDetailResp {
  @ApiProperty() userId!: string;
  @ApiProperty() fullName!: string;
  @ApiProperty() email!: string;
  @ApiProperty({ nullable: true }) phone!: string | null;
  @ApiProperty() socialSecurity!: string;
  @ApiProperty({ type: AccountStateResp }) accountState!: AccountStateResp;
  @ApiProperty({ type: [TipoRefResp] }) roles!: TipoRefResp[];

  @ApiProperty() companyName!: string;
  @ApiProperty({ nullable: true, type: TipoRefResp })
  businessType!: TipoRefResp | null;

  @ApiProperty({ nullable: true, type: TipoRefResp })
  country!: TipoRefResp | null;
  @ApiProperty({ nullable: true, type: TipoRefResp })
  province!: TipoRefResp | null;
  @ApiProperty({ nullable: true, type: TipoRefResp })
  municipality!: TipoRefResp | null;

  @ApiProperty({ nullable: true }) foundedOn!: string | null;
  @ApiProperty({ nullable: true }) employeeCount!: number | null;

  @ApiProperty({ nullable: true }) fiscalAddress!: string | null;
  @ApiProperty({ nullable: true }) city!: string | null;
  @ApiProperty({ nullable: true }) postalCode!: string | null;
  @ApiProperty({ nullable: true }) website!: string | null;

  @ApiProperty({ type: [DocumentResp] }) documents!: DocumentResp[];
}

export class OkCompanyResponse {
  @ApiProperty({ example: true }) success!: true;
  @ApiProperty({ type: CompanyDetailResp }) data!: CompanyDetailResp;
}
