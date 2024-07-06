import { User } from '../../../features/users/entities/user.entity';
import { JournalCategory } from '../../../features/journal-categories/entities/journal-category.entity';
import { CommonEntityFields } from '../../../utils/entities/CommonEntityFields';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Journal extends CommonEntityFields {
  constructor(partial: Partial<Journal>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    length: 256,
  })
  title: string;

  @Column({
    type: 'text',
  })
  content: string;

  @ManyToOne(() => JournalCategory, (category) => category.journals, {
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
    // cascade: ['insert', 'update'],
  })
  @JoinColumn()
  category: JournalCategory;

  @ManyToOne(() => User, (user) => user.journals, {
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  user: User;

  @Column({
    type: 'timestamptz',
  })
  entryDate: Date;
}
