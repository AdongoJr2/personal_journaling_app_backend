import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntityFields } from '../../../utils/entities/CommonEntityFields';
import { Exclude } from 'class-transformer';
import { Journal } from '../../../features/journals/entities/journal.entity';

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

  @Column({
    unique: true,
  })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Journal, (journal) => journal.user)
  journals: Journal[];
}
