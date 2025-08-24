import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './entities/currency.entity';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async create(createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
    const currency = this.currencyRepository.create(createCurrencyDto);
    return await this.currencyRepository.save(currency);
  }

  async findAll(): Promise<Currency[]> {
    return await this.currencyRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Currency> {
    const currency = await this.currencyRepository.findOne({ where: { id } });
    if (!currency) {
      throw new NotFoundException(`Moneda con ID ${id} no encontrada`);
    }
    return currency;
  }

  async update(
    id: number,
    updateCurrencyDto: UpdateCurrencyDto,
  ): Promise<Currency> {
    const currency = await this.findOne(id);

    Object.assign(currency, updateCurrencyDto);

    return await this.currencyRepository.save(currency);
  }

  async remove(id: number): Promise<void> {
    const currency = await this.findOne(id);
    await this.currencyRepository.remove(currency);
  }

  async toggleStatus(id: number): Promise<Currency> {
    const currency = await this.findOne(id);
    currency.status = !currency.status;
    return await this.currencyRepository.save(currency);
  }

  async findByStatus(status: boolean): Promise<Currency[]> {
    return await this.currencyRepository.find({
      where: { status },
      order: { id: 'ASC' },
    });
  }
}
