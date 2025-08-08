import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Pais } from '../paises/pais.entity';
import { Provincia } from '../provincias/provincia.entity';
import { Ciudad } from '../ciudades/ciudad.entity';
import { Ocupaciones } from '../ocupaciones/ocupaciones.entity';
import { Genero } from '../generos/genero.entity';
import { ClienteDocumentos } from './cliente-documentos.entity';
import { Credenciales } from './credenciales.entity';
import { ContactoAlternativo } from './contacto-alternativo.entity';
import { RegistroFinalizado } from './registro-finalizado.entity';

@Entity({ name: 'clientes' })
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  nombres: string;

  @Column({ type: 'text' })
  apellidos: string;

  @Column({ type: 'text' })
  telefono: string;

  @Column({ type: 'text', nullable: true })
  direccion?: string;

  @Column({ name: 'fecha_nac', type: 'date', nullable: true })
  fechaNac?: Date;

  @ManyToOne(() => Pais)
  @JoinColumn({ name: 'pais_id' })
  pais?: Pais;

  @Column({ name: 'pais_id', nullable: true })
  paisId?: number;

  @ManyToOne(() => Provincia)
  @JoinColumn({ name: 'provincia_id' })
  provincia?: Provincia;

  @Column({ name: 'provincia_id', nullable: true })
  provinciaId?: number;

  @ManyToOne(() => Ciudad)
  @JoinColumn({ name: 'ciudad_id' })
  ciudad?: Ciudad;

  @Column({ name: 'ciudad_id', nullable: true })
  ciudadId?: number;

  @ManyToOne(() => Ocupaciones)
  @JoinColumn({ name: 'ocupacion_id' })
  ocupacion?: Ocupaciones;

  @Column({ name: 'ocupacion_id', nullable: true })
  ocupacionId?: number;

  @ManyToOne(() => Genero)
  @JoinColumn({ name: 'genero_id' })
  genero?: Genero;

  @Column({ name: 'genero_id', nullable: true })
  generoId?: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToOne(() => ClienteDocumentos, (documentos) => documentos.cliente)
  documentos: ClienteDocumentos;

  @OneToOne(() => Credenciales, (cred) => cred.cliente)
  credenciales: Credenciales;

  @OneToOne(() => ContactoAlternativo, (contacto) => contacto.cliente)
  contactoAlternativo: ContactoAlternativo;

  @OneToOne(() => RegistroFinalizado, (reg) => reg.cliente)
  registroFinalizado: RegistroFinalizado;
}
