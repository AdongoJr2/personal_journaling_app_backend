import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Logger,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { ApiResponseService } from 'src/core/modules/api-response/api-response/api-response.service';
import { ApiListResponseService } from 'src/core/modules/api-response/api-list-response/api-list-response.service';
import { ConfigService } from '@nestjs/config';
import { ErrorHandlingService } from 'src/shared/error-handling/error-handling.service';
import { CustomNotFoundException } from 'src/utils/exceptions/not-found.exception';
import { APIResponseBodyStatus } from 'src/core/types/api-response-body-status';
import { DtoValidationPipe } from 'src/core/pipes/dto-validation/dto-validation.pipe';
import { DeepPartial } from 'typeorm';
import { User } from './entities/user.entity';
import { TokenUserData } from 'src/core/types/token-user-data';
import { CustomForbiddenException } from 'src/utils/exceptions/forbidden.exception';

@ApiTags('Users')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly apiResponseService: ApiResponseService,
    private readonly apiListResponseService: ApiListResponseService,
    private readonly configService: ConfigService,
    private readonly errorHandlingService: ErrorHandlingService,
    private readonly logger: Logger,
  ) {}

  // @ApiOperation({
  //   summary: 'Users Listing',
  // })
  // @ApiQueryParams('page', 'pageSize', 'filter', 'sort', 'search')
  // @Get()
  // async findAll(
  //   @Query('page', new DefaultValuePipe(defaultPageValues.page), ParseIntPipe)
  //   page: number,
  //   @Query(
  //     'pageSize',
  //     new DefaultValuePipe(defaultPageValues.pageSize),
  //     ParseIntPipe,
  //   )
  //   pageSize: number,
  //   @Query('filter', new DefaultValuePipe(''))
  //   filter: string,
  //   @Query('sort', new DefaultValuePipe(''))
  //   sort: string,
  //   @Query('search', new DefaultValuePipe(''))
  //   search: string,
  // ) {
  //   try {
  //     const [users, count] = await this.usersService.findAll(
  //       page,
  //       pageSize,
  //       filter,
  //       search,
  //       sort,
  //     );

  //     const responseBody = this.apiListResponseService.getResponseBody({
  //       message: 'Users retrieved successfully',
  //       count,
  //       pageSize,
  //       records: users,
  //     });

  //     return responseBody;
  //   } catch (error: any) {
  //     throw this.errorHandlingService.getException(error);
  //   }
  // }

  @ApiOperation({
    summary: 'User Details',
  })
  @Get(':userId')
  async findOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req: any,
  ) {
    try {
      const userTokenData = req.user as TokenUserData;

      if (userTokenData.id !== userId) {
        throw new CustomForbiddenException();
      }

      const foundUser = await this.usersService.findOne(userId);
      if (!foundUser) {
        throw new CustomNotFoundException(
          `User with id: ${userId} does not exist`,
        );
      }

      const responseBody = this.apiResponseService.getResponseBody({
        status: APIResponseBodyStatus.SUCCESS,
        message: 'User retrieved successfully',
        data: foundUser,
      });

      return responseBody;
    } catch (error) {
      throw this.errorHandlingService.getException(error);
    }
  }

  @ApiOperation({
    summary: 'User Update',
  })
  @Patch(':userId')
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body(DtoValidationPipe) updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    try {
      const userTokenData = req.user as TokenUserData;

      if (userTokenData.id !== userId) {
        throw new CustomForbiddenException();
      }

      const foundUser = await this.usersService.findOne(userId);

      let hashedPassword = foundUser.password;
      if (updateUserDto.password) {
        hashedPassword = await this.authService.hashPassword(
          updateUserDto.password,
        );
      }

      const detailsToUpdate: DeepPartial<User> = {
        ...foundUser,
        ...updateUserDto,
        password: hashedPassword,
      };

      const updateResult = await this.usersService.update(detailsToUpdate);

      const responseBody = this.apiResponseService.getResponseBody({
        status: APIResponseBodyStatus.SUCCESS,
        message: 'User updated successfully',
        data: updateResult,
      });

      return responseBody;
    } catch (error) {
      throw this.errorHandlingService.getException(error);
    }
  }

  // @ApiOperation({
  //   summary: 'User Deletion',
  // })
  // @Delete(':id')
  // async remove(@Param('id', ParseIntPipe) id: number) {
  //   try {
  //     await this.usersService.findOne(id);
  //     await this.usersService.remove(id);

  //     const responseBody = this.apiResponseService.getResponseBody({
  //       status: APIResponseBodyStatus.SUCCESS,
  //       message: 'User deleted successfully',
  //       data: undefined,
  //     });

  //     return responseBody;
  //   } catch (error) {
  //     throw this.errorHandlingService.getException(error);
  //   }
  // }
}
