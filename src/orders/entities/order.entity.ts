import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  @Index()
  order_code: string; // p.ej. ORD-...

  @Column({ type: 'uuid', nullable: true })
  @Index()
  buyer_user_id: string | null;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  seller_user_id: string | null;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  issued_on: string;

  @Column({ type: 'date', nullable: true })
  delivery_on: string | null;

  @Column({ type: 'char', length: 3, default: 'SOL' })
  status_tab: string;

  @Column({ type: 'char', length: 3, default: '001' })
  status_cod: string; // 001 Pendiente, 002 Aprobada, 003 Rechazada

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  total_amount: string;

  @Column({ type: 'char', length: 3, default: 'MON' })
  currency_tab: string;

  @Column({ type: 'char', length: 3 })
  currency_cod: string;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  created_at: Date;
}
