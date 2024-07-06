import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokensService } from '../refresh-tokens/refresh-tokens.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import {
  TokenType,
  TokenUserData,
  VerifiedToken,
} from 'src/core/types/token-user-data';
import { CustomNotFoundException } from 'src/utils/exceptions/not-found.exception';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private refreshTokensService: RefreshTokensService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private logger: Logger,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = await this.usersService.createUser(createUserDto);
      return new User({ ...newUser });
    } catch (error) {
      throw error;
    }
  }

  async validateUser(
    loginUserDetails: LoginUserDto,
  ): Promise<TokenUserData | null> {
    try {
      const foundUser = await this.usersService.findOneByPhoneNumber(
        loginUserDetails.phoneNumber,
      );

      const isPasswordCorrect = await bcrypt.compare(
        loginUserDetails?.password,
        foundUser.password,
      );
      if (!isPasswordCorrect) {
        return null;
      }

      const user: TokenUserData = {
        id: foundUser.id,
      };

      return user;
    } catch (error) {
      return null;
    }
  }

  async login(tokenUserData: TokenUserData) {
    try {
      const authTokens = await this.generateAuthTokens(tokenUserData);

      await this.refreshTokensService.create(authTokens.refreshToken);

      return authTokens;
    } catch (error) {
      throw error;
    }
  }

  async refreshAuthTokens(verifiedToken: VerifiedToken, refreshToken: string) {
    try {
      // this.logger.debug(verifiedToken, 'VERIFIED REFRESH TOKEN');

      const foundUser = await this.usersService.findOne(+verifiedToken.sub);
      if (!foundUser) {
        throw new CustomNotFoundException(`User not found`);
      }

      const foundRefreshToken =
        await this.refreshTokensService.findOneByToken(refreshToken);
      if (!foundRefreshToken) {
        throw new CustomNotFoundException(
          `The refresh token provided is invalid or has expired`,
        );
      }

      // const refreshTokenMatches = await bcrypt.compare(
      //   foundRefreshToken.token,
      //   refreshToken,
      // );
      // if (!refreshTokenMatches) throw new CustomForbiddenException();

      const tokenPayload = {
        id: foundUser.id,
      };

      const tokens = await this.generateAuthTokens(tokenPayload);

      // delete the previous refresh token from the database
      await this.refreshTokensService.delete(foundRefreshToken.id);
      await this.refreshTokensService.create(tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw error;
    }
  }

  async generateAuthTokens({ id }: TokenUserData) {
    const payload = { sub: id };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>(
          'ACCESS_TOKEN_EXPIRY_TIMESPAN',
        ),
      }),

      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>(
          'REFRESH_TOKEN_EXPIRY_TIMESPAN',
        ),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  verifyJWTAuthToken(
    token: string,
    tokenType: TokenType = 'access',
  ): Promise<VerifiedToken> {
    const tokenSecret =
      tokenType === 'access'
        ? (this.configService.get<string>('ACCESS_TOKEN_SECRET') as string)
        : (this.configService.get<string>('REFRESH_TOKEN_SECRET') as string);

    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        tokenSecret,
        (err: any, verifiedToken: VerifiedToken) => {
          if (err) {
            reject(
              // TODO: reject with '403' exception when 'tokenType' === 'access'
              new CustomNotFoundException(
                `The ${tokenType} token provided is invalid or has expired`,
              ),
            );
          }

          resolve(verifiedToken);
        },
      );
    });
  }

  async hashPassword(rawPassword: string) {
    try {
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      return hashedPassword;
    } catch (error) {
      throw error;
    }
  }
}
