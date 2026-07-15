import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 120,
  })
  name?: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 180,
    unique: true,
  })
  email?: string;

  @Column({
    name: 'passwordHash',
    type: 'varchar',
    length: 255,
  })
  passwordHash?: string;

  @Column({
    name: 'createdAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;
}
