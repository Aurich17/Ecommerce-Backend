import { ApiProperty } from '@nestjs/swagger';

class OrderListItem {
  @ApiProperty() id!: number;
  @ApiProperty() nro_orden!: string;
  @ApiProperty() fecha_emision!: string;
  @ApiProperty({ nullable: true }) fecha_entrega!: string | null;
  @ApiProperty() estado!: string;
  @ApiProperty() total!: string;
  @ApiProperty() moneda!: string;
  @ApiProperty() notas!: string;
  @ApiProperty() creado_el!: string;
}

export class OrdersListResponse {
  @ApiProperty({ example: true }) success!: true;
  @ApiProperty({
    example: { items: [], total: 0, page: 1, limit: 20 },
  })
  data!: { items: OrderListItem[]; total: number; page: number; limit: number };
}

class OrderItemResp {
  @ApiProperty() id!: number;
  @ApiProperty() productId!: string | null;
  @ApiProperty() productName!: string;
  @ApiProperty() quantity!: string;
  @ApiProperty() unitPrice!: string;
  @ApiProperty() lineTotal!: string;
}

class OrderDetailResp {
  @ApiProperty() id!: number;
  @ApiProperty() orderCode!: string;
  @ApiProperty({ nullable: true }) buyerUserId!: string | null;
  @ApiProperty({ nullable: true }) sellerUserId!: string | null;
  @ApiProperty() issuedOn!: string;
  @ApiProperty({ nullable: true }) deliveryOn!: string | null;

  @ApiProperty() status!: { tab: 'SOL'; cod: string; desc: string };
  @ApiProperty() currency!: { tab: 'MON'; cod: string; desc: string };

  @ApiProperty() total!: string;
  @ApiProperty({ nullable: true }) notes!: string | null;
  @ApiProperty({ type: [OrderItemResp] }) items!: OrderItemResp[];
  @ApiProperty() createdAt!: string;
}

export class OrderDetailResponse {
  @ApiProperty({ example: true }) success!: true;
  @ApiProperty({ type: OrderDetailResp }) data!: OrderDetailResp;
}
