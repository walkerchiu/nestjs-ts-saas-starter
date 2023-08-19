import { BaseEntity, Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('users')
@Index(['name', 'email'])
export class UserEntity extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ length: 255, nullable: true })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;
}
