import { Module } from '@nestjs/common';
import { JournalsService } from './journals.service';
import { JournalsController } from './journals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journal } from './entities/journal.entity';
import { ApiResponseModule } from 'src/core/modules/api-response/api-response.module';
import { SharedModule } from 'src/shared/shared.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Journal]),
    ApiResponseModule,
    SharedModule,
    AuthModule,
  ],
  controllers: [JournalsController],
  providers: [JournalsService],
  exports: [TypeOrmModule, JournalsService],
})
export class JournalsModule {}
