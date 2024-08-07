import { ISession } from 'connect-typeorm';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Session implements ISession {
  @Index()
  @Column({ type: 'bigint', default: 0 })
  expiredAt: number;

  @PrimaryColumn({ type: 'varchar', length: 255, default: '' })
  id: string;

  @Column({ type: 'text', default: '' })
  json: string;

  @DeleteDateColumn()
  destroyedAt?: Date;
}
