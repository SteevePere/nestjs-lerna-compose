import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/*All entities should extend this one to stay DRY*/
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid') // imo uuids are superior to autoincrement integers!
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
