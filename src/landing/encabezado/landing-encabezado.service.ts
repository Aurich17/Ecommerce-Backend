import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LandingEncabezado } from './landing-encabezado.entity';
import { UpdateLandingEncabezadoDto } from './dto/update-landing-encabezado.dto';

const ROW_ID = 1;

@Injectable()
export class LandingEncabezadoService {
  constructor(
    @InjectRepository(LandingEncabezado)
    private readonly repo: Repository<LandingEncabezado>,
  ) {}

  /** Garantiza que exista la fila 1 con valores por defecto */
  private async ensureRow(): Promise<LandingEncabezado> {
    let row = await this.repo.findOne({ where: { id: ROW_ID } });
    if (!row) {
      row = this.repo.create({
        id: ROW_ID,
        titulo_principal: 'Bienvenido a FIAOX',
        subtitulo: 'Flexibilizamos las compras en CUBA con PAGOS EN CUOTAS',
        parrafo_encabezado:
          'Compra el producto que necesitas pagando solo el 50% al inicio. Recibe el producto y paga el resto en dos cómodas cuotas.',
        titulo_marketplace: 'Descubre lo mejor del mercado',
        subtitulo_marketplace:
          'Compra productos directamente de empresas verificadas en un solo lugar',
        nota: 'Las tiendas reciben una parte inicial y luego FIAOX recuerda al cliente el pago restante.',
      });
      await this.repo.save(row);
    }
    return row;
  }

  async get(): Promise<LandingEncabezado> {
    return this.ensureRow();
  }

  async update(dto: UpdateLandingEncabezadoDto): Promise<LandingEncabezado> {
    await this.ensureRow();
    await this.repo.update({ id: ROW_ID }, dto);
    return this.repo.findOneByOrFail({ id: ROW_ID });
  }
}
