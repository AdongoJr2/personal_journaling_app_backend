import { Injectable } from '@nestjs/common';
import { RefreshToken } from './entities/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomNotFoundException } from 'src/utils/exceptions/not-found.exception';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async create(token: string): Promise<RefreshToken> {
    try {
      const newRefreshToken = this.refreshTokenRepository.create({ token });
      const savedRefreshToken =
        await this.refreshTokenRepository.save(newRefreshToken);
      return new RefreshToken({ ...savedRefreshToken });
    } catch (error) {
      throw error;
    }
  }

  async findOneByToken(token: string) {
    try {
      const foundItem = await this.refreshTokenRepository.findOne({
        where: { token },
      });

      if (!foundItem) {
        throw new CustomNotFoundException(
          `The refresh token provided does not exist`,
        );
      }

      return foundItem;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const result = await this.refreshTokenRepository.delete(id);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
