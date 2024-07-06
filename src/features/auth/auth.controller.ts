import {
  Controller,
  Post,
  Body,
  Logger,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RefreshTokensService } from '../refresh-tokens/refresh-tokens.service';
import { ApiResponseService } from 'src/core/modules/api-response/api-response/api-response.service';
import { ErrorHandlingService } from 'src/shared/error-handling/error-handling.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DtoValidationPipe } from 'src/core/pipes/dto-validation/dto-validation.pipe';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { APIResponseBodyStatus } from 'src/core/types/api-response-body-status';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { TokenUserData } from 'src/core/types/token-user-data';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutUserDto } from './dto/logout-user.dto';

@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly apiResponseService: ApiResponseService,
    private readonly errorHandlingService: ErrorHandlingService,
    private readonly logger: Logger,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Registration',
  })
  @Post('signup')
  async signup(@Body(new DtoValidationPipe()) createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await this.authService.hashPassword(
        createUserDto.password,
      );
      createUserDto.password = hashedPassword;

      const createdUser = await this.authService.createUser(createUserDto);

      const responseBody = this.apiResponseService.getResponseBody({
        status: APIResponseBodyStatus.SUCCESS,
        message: 'User registered successfully',
        data: createdUser,
      });

      return responseBody;
    } catch (error: any) {
      throw this.errorHandlingService.getException(error);
    }
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Login',
  })
  @Post('login')
  async login(
    @Request() req: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body(DtoValidationPipe) loginUserDto: LoginUserDto,
  ) {
    try {
      const userTokenData = req.user as TokenUserData;

      const authTokens = await this.authService.login(userTokenData);

      const responseBody = this.apiResponseService.getResponseBody({
        status: APIResponseBodyStatus.SUCCESS,
        message: 'User logged in successfully',
        data: authTokens,
      });

      return responseBody;
    } catch (error: any) {
      throw this.errorHandlingService.getException(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Auth tokens refresh',
  })
  @Post('token-refresh')
  async tokenRefresh(
    @Body(DtoValidationPipe) refreshTokenDto: RefreshTokenDto,
  ) {
    try {
      const verifiedRefreshToken = await this.authService.verifyJWTAuthToken(
        refreshTokenDto.refreshToken,
        'refresh',
      );

      const newAuthTokens = await this.authService.refreshAuthTokens(
        verifiedRefreshToken,
        refreshTokenDto.refreshToken,
      );

      const responseBody = this.apiResponseService.getResponseBody({
        status: APIResponseBodyStatus.SUCCESS,
        message: 'Auth tokens refreshed successfully',
        data: newAuthTokens,
      });

      return responseBody;
    } catch (error) {
      throw this.errorHandlingService.getException(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Logout',
  })
  @Post('logout')
  async logout(@Body(DtoValidationPipe) logoutUserDto: LogoutUserDto) {
    try {
      const foundRefreshToken = await this.refreshTokensService.findOneByToken(
        logoutUserDto.refreshToken,
      );

      await this.refreshTokensService.delete(foundRefreshToken.id);

      const responseBody = this.apiResponseService.getResponseBody({
        status: APIResponseBodyStatus.SUCCESS,
        message: 'user logged out successfully',
        data: undefined,
      });

      return responseBody;
    } catch (error) {
      throw this.errorHandlingService.getException(error);
    }
  }
}
