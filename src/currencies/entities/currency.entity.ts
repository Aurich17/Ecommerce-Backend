import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('curency_system')
export class Currency {
  @ApiProperty({ description: 'ID único de la moneda' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Descripción de la moneda', example: 'DOLARES' })
  @Column({ type: 'varchar', length: 255 })
  description: string;

  @ApiProperty({ description: 'Prefijo de la moneda', example: 'USD' })
  @Column({ type: 'varchar', length: 10 })
  prefijo: string;

  @ApiProperty({ description: 'Símbolo de la moneda', example: '$' })
  @Column({ type: 'varchar', length: 5 })
  signo: string;

  @ApiProperty({ description: 'Estado de la moneda', example: true })
  @Column({ type: 'boolean', default: true })
  status: boolean;
}
