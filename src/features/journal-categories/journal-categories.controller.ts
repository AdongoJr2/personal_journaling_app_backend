import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Logger,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JournalCategoriesService } from './journal-categories.service';
import { CreateJournalCategoryDto } from './dto/create-journal-category.dto';
import { UpdateJournalCategoryDto } from './dto/update-journal-category.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { ApiListResponseService } from 'src/core/modules/api-response/api-list-response/api-list-response.service';
import { ApiResponseService } from 'src/core/modules/api-response/api-response/api-response.service';
import { ErrorHandlingService } from 'src/shared/error-handling/error-handling.service';
import { AuthService } from '../auth/auth.service';
import { ApiQueryParams } from 'src/core/decorators/api-query-params.decorator';
import { defaultPageValues } from 'src/utils/pagination/pagination';
import { DtoValidationPipe } from 'src/core/pipes/dto-validation/dto-validation.pipe';
import { APIResponseBodyStatus } from 'src/core/types/api-response-body-status';
import { CustomNotFoundException } from 'src/utils/exceptions/not-found.exception';
import { DeepPartial } from 'typeorm';
import { JournalCategory } from './entities/journal-category.entity';

@ApiTags('Journal Categories')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('journal-categories')
export class JournalCategoriesController {
  constructor(
    private readonly journalCategoriesService: JournalCategoriesService,
    private readonly authService: AuthService,
    private readonly apiResponseService: ApiResponseService,
    private readonly apiListResponseService: ApiListResponseService,
    private readonly configService: ConfigService,
    private readonly errorHandlingService: ErrorHandlingService,
    private readonly logger: Logger,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Journal Category Addition',
  })
  @Post()
  async create(
    @Body(DtoValidationPipe)
    createJournalCategoryDto: CreateJournalCategoryDto,
  ) {
    try {
      const createdRecord = await this.journalCategoriesService.create(
        createJournalCategoryDto,
      );

      const responseBody = this.apiResponseService.getResponseBody({
        status: APIResponseBodyStatus.SUCCESS,
        message: 'Journal Category created successfully',
        data: createdRecord,
      });

      return responseBody;
    } catch (error) {
      throw this.errorHandlingService.getException(error);
    }
  }

  @ApiOperation({
    summary: 'Journal Categories Listing',
  })
  @ApiQueryParams('page', 'pageSize', 'filter', 'sort', 'search')
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(defaultPageValues.page), ParseIntPipe)
    page: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(defaultPageValues.pageSize),
      ParseIntPipe,
    )
    pageSize: number,
    @Query('filter', new DefaultValuePipe(''))
    filter: string,
    @Query('sort', new DefaultValuePipe(''))
    sort: string,
    @Query('search', new DefaultValuePipe(''))
    search: string,
  ) {
    try {
      const [records, count] = await this.journalCategoriesService.findAll(
        page,
        pageSize,
        filter,
        search,
        sort,
      );

      const responseBody = this.apiListResponseService.getResponseBody({
        message: 'Journal Categories retrieved successfully',
        count,
        pageSize,
        records,
      });

      return responseBody;
    } catch (error: any) {
      throw this.errorHandlingService.getException(error);
    }
  }

  @ApiOperation({
    summary: 'Journal Category Details',
  })
  @Get(':categoryId')
  async findOne(@Param('categoryId', ParseIntPipe) categoryId: number) {
    try {
      const foundRecord =
        await this.journalCategoriesService.findOne(categoryId);
      if (!foundRecord) {
        throw new CustomNotFoundException(
          `Journal Category with id: ${categoryId} does not exist`,
        );
      }

      const responseBody = this.apiResponseService.getResponseBody({
        status: APIResponseBodyStatus.SUCCESS,
        message: 'Journal Category retrieved successfully',
        data: foundRecord,
      });

      return responseBody;
    } catch (error) {
      throw this.errorHandlingService.getException(error);
    }
  }

  @ApiOperation({
    summary: 'Journal Category Update',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':categoryId')
  async update(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body(DtoValidationPipe) updateJournalCategoryDto: UpdateJournalCategoryDto,
  ) {
    try {
      const foundRecord =
        await this.journalCategoriesService.findOne(categoryId);

      const detailsToUpdate: DeepPartial<JournalCategory> = {
        ...foundRecord,
        ...updateJournalCategoryDto,
      };

      const updateResult =
        await this.journalCategoriesService.update(detailsToUpdate);

      const responseBody = this.apiResponseService.getResponseBody({
        status: APIResponseBodyStatus.SUCCESS,
        message: 'Journal Category updated successfully',
        data: updateResult,
      });

      return responseBody;
    } catch (error) {
      throw this.errorHandlingService.getException(error);
    }
  }

  @ApiOperation({
    summary: 'Journal Category Deletion',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':categoryId')
  async remove(@Param('categoryId', ParseIntPipe) categoryId: number) {
    try {
      await this.journalCategoriesService.findOne(categoryId);
      await this.journalCategoriesService.remove(categoryId);

      const responseBody = this.apiResponseService.getResponseBody({
        status: APIResponseBodyStatus.SUCCESS,
        message: 'Journal Category deleted successfully',
        data: undefined,
      });

      return responseBody;
    } catch (error) {
      throw this.errorHandlingService.getException(error);
    }
  }
}
