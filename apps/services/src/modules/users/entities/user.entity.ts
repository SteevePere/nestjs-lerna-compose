import { UserGenderEnum, UserRoleEnum } from '@perspective/shared';
import { BaseEntity } from 'src/core/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
  // Basic fields such as id, createdAt, etc. are inherited
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string;

  @Column({ type: 'timestamptz' })
  birthDate: Date;

  @Column({
    type: 'enum',
    enum: UserGenderEnum,
  })
  gender: UserGenderEnum;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  role: UserRoleEnum;
}
