import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tarefas {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    name: 'titulo',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: false,
  })
  titulo?: string;

  @Column({
    name: 'descricao',
    type: 'text',
    nullable: false,
    unique: false,
  })
  descricao?: string;

  @Column({
    name: 'status',
    type: 'boolean',
    default: false,
  })
  status?: boolean;

  @Column({
    name: 'createdAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;
}
