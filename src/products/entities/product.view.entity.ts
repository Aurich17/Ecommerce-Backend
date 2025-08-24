import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'v_products_list' })
export class ProductListView {
  @ViewColumn() id: number;
  @ViewColumn() nombre_producto: string; // name
  @ViewColumn() descripcion: string | null;
  @ViewColumn() precio: string; // DECIMAL como string
  @ViewColumn() stock: number;
  @ViewColumn() descuento: string; // '10%' o '-'
  @ViewColumn() moneda: string; // 'USD'
  @ViewColumn() enabled: boolean;
  @ViewColumn() created_at: Date;
  @ViewColumn() url_img: string | null;
}
