import { Module } from '@nestjs/common';
import { JournalCategoriesService } from './journal-categories.service';
import { JournalCategoriesController } from './journal-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { ApiResponseModule } from 'src/core/modules/api-response/api-response.module';
import { JournalCategory } from './entities/journal-category.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JournalCategory]),
    ApiResponseModule,
    SharedModule,
    AuthModule,
  ],
  controllers: [JournalCategoriesController],
  providers: [JournalCategoriesService],
  exports: [TypeOrmModule, JournalCategoriesService],
})
export class JournalCategoriesModule {}
