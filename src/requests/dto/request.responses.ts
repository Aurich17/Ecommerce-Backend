import { ApiProperty } from '@nestjs/swagger';

class RequestItem {
  @ApiProperty() id!: number;
  @ApiProperty() subjectName!: string;
  @ApiProperty({ nullable: true }) subjectUserId!: string | null;
  @ApiProperty({ nullable: true }) requesterUserId!: string | null;

  @ApiProperty({ example: 'REQ' }) reqTab!: string;
  @ApiProperty({ example: '001' }) reqCod!: string;
  @ApiProperty({ example: 'EST' }) statusTab!: string;
  @ApiProperty({ example: '001' }) statusCod!: string;

  @ApiProperty({ nullable: true }) description!: string | null;
  @ApiProperty() createdAt!: string;

  @ApiProperty({ nullable: true }) reviewedBy!: string | null;
  @ApiProperty({ nullable: true }) reviewedAt!: string | null;
  @ApiProperty({ nullable: true }) reviewNotes!: string | null;
}

export class RequestsListResponse {
  @ApiProperty({ example: true }) success!: true;
  @ApiProperty({
    example: { items: [], total: 0, page: 1, limit: 20 },
  })
  data!: { items: RequestItem[]; total: number; page: number; limit: number };
}

export class RequestDetailResponse {
  @ApiProperty({ example: true }) success!: true;
  @ApiProperty({ type: RequestItem }) data!: RequestItem;
}
