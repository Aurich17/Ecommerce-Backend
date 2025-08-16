import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'v_orders_list' })
export class OrderListView {
  @ViewColumn() id: number;
  @ViewColumn() nro_orden: string;
  @ViewColumn() fecha_emision: string;
  @ViewColumn() fecha_entrega: string | null;
  @ViewColumn() estado: string; // des_tipo(SOL)
  @ViewColumn() total: string;
  @ViewColumn() moneda: string; // des_tipo(MON)
  @ViewColumn() notas: string;
  @ViewColumn() creado_el: Date;
}
