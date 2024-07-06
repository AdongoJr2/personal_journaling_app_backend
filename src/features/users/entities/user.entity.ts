import { Column, Entity } from 'typeorm';
import { CommonEntityFields } from '../../../utils/entities/CommonEntityFields';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends CommonEntityFields {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    length: 200,
  })
  firstName: string;

  @Column({
    length: 200,
  })
  lastName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    unique: true,
  })
  phoneNumber: string;

  @Column()
  @Exclude()
  password: string;
}
