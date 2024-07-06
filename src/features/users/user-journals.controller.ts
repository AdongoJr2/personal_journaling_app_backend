import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { ApiListResponseService } from 'src/core/modules/api-response/api-list-response/api-list-response.service';
import { ApiResponseService } from 'src/core/modules/api-response/api-response/api-response.service';
import { ErrorHandlingService } from 'src/shared/error-handling/error-handling.service';
import { AuthService } from '../auth/auth.service';
import { JournalsService } from '../journals/journals.service';
import { ApiQueryParams } from 'src/core/decorators/api-query-params.decorator';
import { defaultPageValues } from 'src/utils/pagination/pagination';
import { TokenUserData } from 'src/core/types/token-user-data';
import { CustomForbiddenException } from 'src/utils/exceptions/forbidden.exception';
import { CustomNotFoundException } from 'src/utils/exceptions/not-found.exception';
import { APIResponseBodyStatus } from 'src/core/types/api-response-body-status';
import { DtoValidationPipe } from 'src/core/pipes/dto-validation/dto-validation.pipe';
import { CreateJournalDto } from '../journals/dto/create-journal.dto';
import { JournalCategoriesService } from '../journal-categories/journal-categories.service';
import { UpdateJournalDto } from '../journals/dto/update-journal.dto';
import { DeepPartial } from 'typeorm';
import { Journal } from '../journals/entities/journal.entity';

@ApiTags('User Journals')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/:userId/journals')
export class UserJournalsController {
  constructor(
    private readonly journalsService: JournalsService,
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
    summary: 'User Journal Addition',
  })
  @Post()
  async create(
    @Body(DtoValidationPipe)
    createJournalDto: CreateJournalDto,
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req: any,
  ) {
    try {
      const userTokenData = req.user as TokenUserData;

      if (userTokenData.id !== userId) {
        throw new CustomForbiddenException();
      }

      await this.journalCategoriesService.findOne(createJournalDto.categoryId);

      const createdRecord = await this.journalsService.create(
        createJournalDto,
        userId,
      );

      const responseBody = this.apiResponseService.getResponseBody({
        status: APIResponseBodyStatus.SUCCESS,
        message: 'User Journal created successfully',
        data: createdRecord,
      });

      return responseBody;
    } catch (error) {
      throw this.errorHandlingService.getException(error);
    }
  }

  @ApiOperation({
    summary: 'User Journal Listing',
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
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req: any,
  ) {
    try {
      const userTokenData = req.user as TokenUserData;

      if (userTokenData.id !== userId) {
        throw new CustomForbiddenException();
      }

      const [records, count] = await this.journalsService.findAllByUserId(
        userId,
        page,
        pageSize,
        filter,
        search,
        sort,
      );

      const responseBody = this.apiListResponseService.getResponseBody({
        message: 'User Journals retrieved successfully',
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
    summary: 'User Journal Details',
  })
  @Get(':journalId')
  async findOneByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('journalId', ParseIntPipe) journalId: number,
    @Request() req: any,
  ) {
    try {
      const userTokenData = req.user as TokenUserData;

      if (userTokenData.id !== userId) {
        throw new CustomForbiddenException();
      }

      const foundRecord = await this.journalsService.findOneByUserId(
        userId,
        journalId,
      );
      if (!foundRecord) {
        throw new CustomNotFoundException(
          `User Journal with id: ${journalId} does not exist`,
        );
      }

      const responseBody = this.apiResponseService.getResponseBody({
        status: APIResponseBodyStatus.SUCCESS,
        message: 'User Journal retrieved successfully',
        data: foundRecord,
      });

      return responseBody;
    } catch (error) {
      throw this.errorHandlingService.getException(error);
    }
  }

  @ApiOperation({
    summary: 'User Journal Update',
  })
  @Patch(':journalId')
  async update(
    @Body(DtoValidationPipe) updateJournalDto: UpdateJournalDto,
    @Param('userId', ParseIntPipe) userId: number,
    @Param('journalId', ParseIntPipe) journalId: number,
    @Request() req: any,
  ) {
    try {
      const userTokenData = req.user as TokenUserData;

      if (userTokenData.id !== userId) {
        throw new CustomForbiddenException();
      }

      const foundRecord = await this.journalsService.findOneByUserId(
        userId,
        journalId,
      );
      if (!foundRecord) {
        throw new CustomNotFoundException(
          `User Journal with id: ${journalId} does not exist`,
        );
      }

      if (updateJournalDto.categoryId) {
        await this.journalCategoriesService.findOne(
          updateJournalDto.categoryId,
        );
      }

      const detailsToUpdate: DeepPartial<Journal> = {
        ...foundRecord,
        ...updateJournalDto,
      };

      if (updateJournalDto.categoryId) {
        detailsToUpdate.category.id = updateJournalDto.categoryId;
      }

      const updateResult = await this.journalsService.update(detailsToUpdate);

      const responseBody = this.apiResponseService.getResponseBody({
        status: APIResponseBodyStatus.SUCCESS,
        message: 'User Journal updated successfully',
        data: updateResult,
      });

      return responseBody;
    } catch (error) {
      throw this.errorHandlingService.getException(error);
    }
  }

  @ApiOperation({
    summary: 'User Journal Deletion',
  })
  @Delete(':journalId')
  async remove(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('journalId', ParseIntPipe) journalId: number,
    @Request() req: any,
  ) {
    try {
      const userTokenData = req.user as TokenUserData;

      if (userTokenData.id !== userId) {
        throw new CustomForbiddenException();
      }

      const foundRecord = await this.journalsService.findOneByUserId(
        userId,
        journalId,
      );
      if (!foundRecord) {
        throw new CustomNotFoundException(
          `User Journal with id: ${journalId} does not exist`,
        );
      }

      await this.journalsService.findOneByUserId(userId, journalId);
      await this.journalsService.remove(journalId);

      const responseBody = this.apiResponseService.getResponseBody({
        status: APIResponseBodyStatus.SUCCESS,
        message: 'User Journal deleted successfully',
        data: undefined,
      });

      return responseBody;
    } catch (error) {
      throw this.errorHandlingService.getException(error);
    }
  }
}
