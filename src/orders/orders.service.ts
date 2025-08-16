import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderListView } from './entities/order.view.entity';
import { ListOrdersQueryDto } from './dto/list-orders.query.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { PatchOrderStatusDto } from './dto/patch-status.dto';
import { Tipo } from '../catalogs/tipo.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ds: DataSource,
    @InjectRepository(Order) private ordersRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemsRepo: Repository<OrderItem>,
    @InjectRepository(OrderListView)
    private viewRepo: Repository<OrderListView>,
    @InjectRepository(Tipo) private tiposRepo: Repository<Tipo>,
  ) {}

  // -------- helpers ----------
  private async assertTipo(tab: string, cod: string) {
    const found = await this.tiposRepo.findOne({
      where: { tab_tabla: tab, cod_tipo: cod },
      select: ['id'],
    });
    if (!found) throw new BadRequestException(`Tipo inválido (${tab}:${cod})`);
  }

  private async nextOrderCode(): Promise<string> {
    // Simple: ORD-<timestamp>. Mejora si quieres secuencias por día.
    return `ORD-${Date.now()}`;
  }

  // -------- list ----------
  async list(q: ListOrdersQueryDto) {
    const baseQB: SelectQueryBuilder<Order> = this.ordersRepo
      .createQueryBuilder('o')
      .where('1=1');

    if (q.q) baseQB.andWhere('o.order_code ILIKE :q', { q: `%${q.q}%` });
    if (q.statusCod)
      baseQB.andWhere(`o.status_tab='SOL' AND o.status_cod=:sc`, {
        sc: q.statusCod,
      });
    if (q.currencyCod)
      baseQB.andWhere(`o.currency_tab='MON' AND o.currency_cod=:mc`, {
        mc: q.currencyCod,
      });
    if (q.buyerUserId)
      baseQB.andWhere('o.buyer_user_id=:b', { b: q.buyerUserId });
    if (q.sellerUserId)
      baseQB.andWhere('o.seller_user_id=:s', { s: q.sellerUserId });
    if (q.issuedFrom)
      baseQB.andWhere('o.issued_on >= :df', { df: q.issuedFrom });
    if (q.issuedTo) baseQB.andWhere('o.issued_on <= :dt', { dt: q.issuedTo });

    const total = await baseQB.getCount();

    const ids = await baseQB
      .select('o.id', 'id')
      .orderBy('o.created_at', 'DESC')
      .offset((q.page - 1) * q.limit)
      .limit(q.limit)
      .getRawMany<{ id: number }>();

    let items: OrderListView[] = [];
    if (ids.length) {
      const idList = ids.map((r) => r.id);
      items = await this.viewRepo
        .createQueryBuilder('v')
        .where('v.id IN (:...idList)', { idList })
        .orderBy('v.creado_el', 'DESC')
        .getMany();
    }

    return { items, total, page: q.page, limit: q.limit };
  }

  // -------- detail ----------
  async getOne(id: number) {
    const o = await this.ordersRepo.findOne({ where: { id } });
    if (!o) throw new NotFoundException('Orden no encontrada');

    const [est, mon, items] = await Promise.all([
      this.tiposRepo.findOne({
        where: { tab_tabla: 'SOL', cod_tipo: o.status_cod },
      }),
      this.tiposRepo.findOne({
        where: { tab_tabla: 'MON', cod_tipo: o.currency_cod },
      }),
      this.itemsRepo.find({ where: { order_id: id } }),
    ]);

    return {
      id: o.id,
      orderCode: o.order_code,
      buyerUserId: o.buyer_user_id,
      sellerUserId: o.seller_user_id,
      issuedOn: o.issued_on,
      deliveryOn: o.delivery_on,
      status: { tab: 'SOL', cod: o.status_cod, desc: est?.des_tipo ?? '' },
      currency: { tab: 'MON', cod: o.currency_cod, desc: mon?.des_tipo ?? '' },
      total: o.total_amount,
      notes: o.notes,
      items: items.map((i) => ({
        id: i.id,
        productId: i.product_id,
        productName: i.product_name,
        quantity: i.quantity,
        unitPrice: i.unit_price,
        lineTotal: i.line_total,
      })),
      createdAt: o.created_at,
    };
  }

  // -------- create ----------
  async create(dto: CreateOrderDto) {
    await this.assertTipo('MON', dto.currencyCod);
    if (!dto.items?.length)
      throw new BadRequestException('Debe incluir al menos un ítem');

    return await this.ds.transaction(async (trx) => {
      // 1) Orden
      const orderCode = await this.nextOrderCode();
      const o = trx.getRepository(Order).create({
        order_code: orderCode,
        buyer_user_id: dto.buyerUserId ?? null,
        seller_user_id: dto.sellerUserId ?? null,
        issued_on: dto.issuedOn ?? new Date().toISOString().slice(0, 10),
        delivery_on: dto.deliveryOn ?? null,
        status_tab: 'SOL',
        status_cod: '001', // Pendiente
        total_amount: '0.00',
        currency_tab: 'MON',
        currency_cod: dto.currencyCod,
        notes: dto.notes ?? null,
      });
      const saved = await trx.getRepository(Order).save(o);

      // 2) Ítems
      let total = 0;
      const items = dto.items.map((it) => {
        const qty = Number(it.quantity);
        const price = Number(it.unitPrice);
        const line = +(qty * price).toFixed(2);
        total += line;
        return trx.getRepository(OrderItem).create({
          order_id: saved.id,
          product_id: it.productId ?? null,
          product_name: it.productName,
          quantity: qty.toFixed(3),
          unit_price: price.toFixed(2),
          line_total: line.toFixed(2),
        });
      });
      await trx.getRepository(OrderItem).save(items);

      // 3) Total
      await trx
        .getRepository(Order)
        .update(saved.id, { total_amount: total.toFixed(2) });

      return this.getOne(saved.id);
    });
  }

  // -------- patch status ----------
  async patchStatus(id: number, body: PatchOrderStatusDto) {
    if (body.tab !== 'SOL') throw new BadRequestException(`tab debe ser 'SOL'`);
    await this.assertTipo('SOL', body.cod);

    const o = await this.ordersRepo.findOne({ where: { id } });
    if (!o) throw new NotFoundException('Orden no encontrada');

    o.status_tab = 'SOL';
    o.status_cod = body.cod;
    o.notes = body.notes ?? o.notes;

    await this.ordersRepo.save(o);
    return this.getOne(id);
  }
}
