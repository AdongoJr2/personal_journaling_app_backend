import { Injectable } from '@nestjs/common';
import { CreateJournalCategoryDto } from './dto/create-journal-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JournalCategory } from './entities/journal-category.entity';
import { DeepPartial, Repository } from 'typeorm';
import { FilterService } from 'src/shared/filter/filter.service';
import { SortService } from 'src/shared/sort/sort.service';
import { ConfigService } from '@nestjs/config';
import { calculateDBOffsetAndLimit } from 'src/utils/pagination/pagination';
import { CustomNotFoundException } from 'src/utils/exceptions/not-found.exception';

@Injectable()
export class JournalCategoriesService {
  constructor(
    @InjectRepository(JournalCategory)
    private journalCategoryRepository: Repository<JournalCategory>,
    private filterService: FilterService,
    private sortService: SortService,
    private configService: ConfigService,
  ) {}

  async create(createJournalCategoryDto: CreateJournalCategoryDto) {
    try {
      const newRecord = this.journalCategoryRepository.create(
        createJournalCategoryDto,
      );

      const savedRecord = await this.journalCategoryRepository.save(newRecord);
      return new JournalCategory({ ...savedRecord });
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    page?: number,
    pageSize?: number,
    filterQuery?: string,
    searchQuery?: string,
    sortQuery?: string,
  ) {
    try {
      const { offset, limit } = calculateDBOffsetAndLimit({ page, pageSize });

      const journalcategoryAlias = 'journalCategory';

      const queryBuilder =
        this.journalCategoryRepository.createQueryBuilder(journalcategoryAlias);

      /* SEARCH */
      await this.filterService.addFiltersQuery(queryBuilder, searchQuery, true);

      /* FILTER */
      await this.filterService.addFiltersQuery(queryBuilder, filterQuery);

      /* SORT */
      await this.sortService.addSortQuery(queryBuilder, sortQuery);

      return queryBuilder
        .select([journalcategoryAlias])
        .skip(offset)
        .take(limit)
        .getManyAndCount();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const foundRecord = await this.journalCategoryRepository.findOne({
        where: { id },
      });

      if (!foundRecord) {
        throw new CustomNotFoundException(`Journal Category not found`);
      }

      return foundRecord;
    } catch (error) {
      throw error;
    }
  }

  async update(detailsToUpdate: DeepPartial<JournalCategory>) {
    try {
      const recordToUpdate =
        this.journalCategoryRepository.create(detailsToUpdate);
      const updatedRecord =
        await this.journalCategoryRepository.save(recordToUpdate);

      return updatedRecord;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const result = await this.journalCategoryRepository.delete(id);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
