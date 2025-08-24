import { ApiProperty } from '@nestjs/swagger';

export class ProductListItem {
  @ApiProperty() id!: number;
  @ApiProperty() nombre_producto!: string;
  @ApiProperty({ nullable: true }) descripcion!: string | null;
  @ApiProperty() precio!: string;
  @ApiProperty() stock!: number;
  @ApiProperty() descuento!: string;
  @ApiProperty() moneda!: string;
  @ApiProperty() enabled!: boolean;
  @ApiProperty() created_at!: string;
  @ApiProperty({ nullable: true }) url_img!: string | null;
}
export class ProductsListResponse {
  @ApiProperty({ example: true }) success!: true;
  @ApiProperty({
    example: { items: [], total: 0, page: 1, limit: 20 },
  })
  data!: {
    items: ProductListItem[];
    total: number;
    page: number;
    limit: number;
  };
}

export class ProductDetail {
  @ApiProperty() id!: number;
  @ApiProperty({ nullable: true }) sellerUserId!: string | null;
  @ApiProperty() name!: string;
  @ApiProperty({ nullable: true }) description!: string | null;
  @ApiProperty() price!: string;
  @ApiProperty() currency!: { tab: 'MON'; cod: string; desc: string };
  @ApiProperty() stock!: number;
  @ApiProperty() discountPercent!: string;
  @ApiProperty() enabled!: boolean;
  @ApiProperty() createdAt!: string;
  @ApiProperty() updatedAt!: string;
  @ApiProperty({ nullable: true }) urlImg!: string | null;
}
export class ProductDetailResponse {
  @ApiProperty({ example: true }) success!: true;
  @ApiProperty({ type: ProductDetail }) data!: ProductDetail;
}
