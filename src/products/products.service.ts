import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from './entities/product.entity';
import { ListProductsQueryDto } from './dto/list-products.query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { PatchProductDto } from './dto/patch-product.dto';
import { Tipo } from '../catalogs/tipo.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    @InjectRepository(Tipo) private tiposRepo: Repository<Tipo>,
  ) {}

  async list(q: ListProductsQueryDto) {
    // view: no tiene seller_user_id; si necesitas filtrar por seller, usa tabla base
    // Hacemos dos consultas: total con base, items con view
    const baseQB: SelectQueryBuilder<Product> = this.repo
      .createQueryBuilder('p')
      .where('1=1');

    if (q.sellerUserId)
      baseQB.andWhere('p.seller_user_id = :s', { s: q.sellerUserId });
    if (q.enabled !== undefined)
      baseQB.andWhere('p.enabled = :e', { e: q.enabled === 'true' });
    if (q.q) baseQB.andWhere('p.name ILIKE :q', { q: `%${q.q}%` });

    const total = await baseQB.getCount();

    // IDs de esta página
    const pagedIds = await baseQB
      .select('p.id', 'id')
      .orderBy('p.created_at', 'DESC')
      .offset((q.page - 1) * q.limit)
      .limit(q.limit)
      .getRawMany<{ id: number }>();

    let items: Product[] = [];
    if (pagedIds.length) {
      const ids = pagedIds.map((r) => r.id);
      items = await this.repo
        .createQueryBuilder('p')
        .where('p.id IN (:...ids)', { ids })
        .orderBy('p.created_at', 'DESC')
        .getMany();
    }

    return { items, total, page: q.page, limit: q.limit };
  }

  async getOne(id: number) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Producto no encontrado');

    return {
      id: p.id,
      sellerUserId: p.seller_user_id,
      name: p.name,
      description: p.description,
      price: p.price_amount,
      stock: p.stock,
      discountPercent: p.discount_percent,
      enabled: p.enabled,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      urlImg: p.url_img,
    };
  }

  async create(dto: CreateProductDto) {
    if (
      dto.discountPercent !== undefined &&
      (dto.discountPercent < 0 || dto.discountPercent > 100)
    ) {
      throw new BadRequestException('discountPercent debe estar entre 0 y 100');
    }

    const ent = this.repo.create({
      seller_user_id: dto.sellerUserId ?? null,
      name: dto.name,
      description: dto.description ?? null,
      price_amount: dto.price.toFixed(2),
      stock: dto.stock,
      discount_percent: (dto.discountPercent ?? 0).toFixed(2),
      enabled: dto.enabled ?? true,
      url_img: dto.urlImg ?? null,
    });

    const saved = await this.repo.save(ent);
    return this.getOne(saved.id);
  }

  async patch(id: number, dto: PatchProductDto) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Producto no encontrado');

    if (
      dto.discountPercent !== undefined &&
      (dto.discountPercent < 0 || dto.discountPercent > 100)
    ) {
      throw new BadRequestException('discountPercent debe estar entre 0 y 100');
    }

    if (dto.sellerUserId !== undefined)
      p.seller_user_id = dto.sellerUserId ?? null;
    if (dto.name !== undefined) p.name = dto.name;
    if (dto.description !== undefined) p.description = dto.description ?? null;
    if (dto.price !== undefined) p.price_amount = dto.price.toFixed(2);
    if (dto.stock !== undefined) p.stock = dto.stock;
    if (dto.discountPercent !== undefined)
      p.discount_percent = (dto.discountPercent ?? 0).toFixed(2);
    if (dto.enabled !== undefined) p.enabled = dto.enabled;
    if (dto.urlImg !== undefined) p.url_img = dto.urlImg ?? null;

    p.updated_at = new Date();
    await this.repo.save(p);
    return this.getOne(id);
  }

  async disable(id: number) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Producto no encontrado');

    p.enabled = false;
    p.updated_at = new Date();
    await this.repo.save(p);
    return this.getOne(id);
  }

  async enable(id: number) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Producto no encontrado');

    p.enabled = true;
    p.updated_at = new Date();
    await this.repo.save(p);
    return this.getOne(id);
  }

  async remove(id: number) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Producto no encontrado');

    // Eliminación lógica: desactivar en lugar de eliminar físicamente
    p.enabled = false;
    p.updated_at = new Date();
    await this.repo.save(p);
    return true;
  }
}
