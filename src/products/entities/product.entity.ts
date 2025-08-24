import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  seller_user_id: string | null; // dueño (usuario empresa)

  @Column({ type: 'text' })
  @Index()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  price_amount: string; // usar como string en TypeORM para DECIMAL

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  discount_percent: string; // 0..100

  @Column({ type: 'boolean', default: true })
  enabled: boolean;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  updated_at: Date;

  @Column({ type: 'text', nullable: true })
  url_img: string | null;
}
