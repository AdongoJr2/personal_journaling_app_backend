import { Journal } from '../../../features/journals/entities/journal.entity';
import { CommonEntityFields } from '../../../utils/entities/CommonEntityFields';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class JournalCategory extends CommonEntityFields {
  constructor(partial: Partial<JournalCategory>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    length: 256,
    unique: true,
  })
  name: string;

  @OneToMany(() => Journal, (journal) => journal.category)
  journals: Journal[];
}
