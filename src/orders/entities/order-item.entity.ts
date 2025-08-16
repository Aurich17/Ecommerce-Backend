import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  order_id: number;

  @Column({ type: 'uuid', nullable: true })
  product_id: string | null;

  @Column({ type: 'text' })
  product_name: string;

  @Column({ type: 'numeric', precision: 12, scale: 3 })
  quantity: string;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  unit_price: string;

  // Si en tu DB es columna generada, igual mapea como normal (TypeORM leerá el valor):
  @Column({ type: 'numeric', precision: 14, scale: 2 })
  line_total: string;
}
