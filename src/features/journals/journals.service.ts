import { Injectable } from '@nestjs/common';
import { CreateJournalDto } from './dto/create-journal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Journal } from './entities/journal.entity';
import { Brackets, DeepPartial, Repository } from 'typeorm';
import { FilterService } from 'src/shared/filter/filter.service';
import { SortService } from 'src/shared/sort/sort.service';
import { ConfigService } from '@nestjs/config';
import { CustomNotFoundException } from 'src/utils/exceptions/not-found.exception';
import { calculateDBOffsetAndLimit } from 'src/utils/pagination/pagination';

@Injectable()
export class JournalsService {
  constructor(
    @InjectRepository(Journal)
    private journalRepository: Repository<Journal>,
    private filterService: FilterService,
    private sortService: SortService,
    private configService: ConfigService,
  ) {}

  async create(createJournalDto: CreateJournalDto, userId: number) {
    try {
      const newRecord = this.journalRepository.create({
        ...createJournalDto,
        category: {
          id: createJournalDto.categoryId,
        },
        user: {
          id: userId,
        },
      });

      const savedRecord = await this.journalRepository.save(newRecord);
      return new Journal({ ...savedRecord });
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

      const journalAlias = 'journal';
      const journalCategoryRelationName = 'journalCategory';

      const queryBuilder =
        this.journalRepository.createQueryBuilder(journalAlias);

      /* SEARCH */
      await this.filterService.addFiltersQuery(queryBuilder, searchQuery, true);

      /* FILTER */
      await this.filterService.addFiltersQuery(queryBuilder, filterQuery);

      /* SORT */
      await this.sortService.addSortQuery(queryBuilder, sortQuery);

      return queryBuilder
        .leftJoinAndSelect(
          `${journalAlias}.${journalCategoryRelationName}`,
          journalCategoryRelationName,
        )
        .select([journalAlias])
        .addSelect([
          `${journalCategoryRelationName}.id`,
          `${journalCategoryRelationName}.name`,
        ])
        .skip(offset)
        .take(limit)
        .getManyAndCount();
    } catch (error) {
      throw error;
    }
  }

  async findAllByUserId(
    userId: number,
    page?: number,
    pageSize?: number,
    filterQuery?: string,
    searchQuery?: string,
    sortQuery?: string,
  ) {
    try {
      const { offset, limit } = calculateDBOffsetAndLimit({ page, pageSize });

      const journalAlias = 'journal';
      const journalCategoryRelationName = 'category';
      const userRelationName = 'user';

      const queryBuilder =
        this.journalRepository.createQueryBuilder(journalAlias);

      /* SEARCH */
      await this.filterService.addFiltersQuery(queryBuilder, searchQuery, true);

      /* FILTER */
      await this.filterService.addFiltersQuery(queryBuilder, filterQuery);

      /* SORT */
      await this.sortService.addSortQuery(queryBuilder, sortQuery);

      return queryBuilder
        .leftJoinAndSelect(
          `${journalAlias}.${journalCategoryRelationName}`,
          journalCategoryRelationName,
        )
        .leftJoinAndSelect(
          `${journalAlias}.${userRelationName}`,
          userRelationName,
        )
        .select([journalAlias])
        .addSelect([
          `${journalCategoryRelationName}.id`,
          `${journalCategoryRelationName}.name`,
        ])
        .andWhere(
          new Brackets((qb) => {
            qb.andWhere(`${userRelationName}.id = :userId`, { userId });
          }),
        )
        .skip(offset)
        .take(limit)
        .getManyAndCount();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const foundRecord = await this.journalRepository.findOne({
        where: { id },
        relations: {
          category: true,
        },
        select: {
          category: {
            id: true,
            name: true,
          },
        },
      });

      if (!foundRecord) {
        throw new CustomNotFoundException(`Journal not found`);
      }

      return foundRecord;
    } catch (error) {
      throw error;
    }
  }

  async findOneByUserId(userId: number, journalId: number) {
    try {
      const foundRecord = await this.journalRepository.findOne({
        where: {
          id: journalId,
          user: {
            id: userId,
          },
        },
        relations: {
          category: true,
        },
        select: {
          category: {
            id: true,
            name: true,
          },
        },
      });

      if (!foundRecord) {
        throw new CustomNotFoundException(`User journal not found`);
      }

      return foundRecord;
    } catch (error) {
      throw error;
    }
  }

  async update(detailsToUpdate: DeepPartial<Journal>) {
    try {
      const recordToUpdate = this.journalRepository.create(detailsToUpdate);
      const updatedRecord = await this.journalRepository.save(recordToUpdate);

      return updatedRecord;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const result = await this.journalRepository.delete(id);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
