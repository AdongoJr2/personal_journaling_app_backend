import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ApiResponseModule } from 'src/core/modules/api-response/api-response.module';
import { SharedModule } from 'src/shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { UserJournalsController } from './user-journals.controller';
import { JournalsModule } from '../journals/journals.module';
import { JournalCategoriesModule } from '../journal-categories/journal-categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ApiResponseModule,
    SharedModule,
    JournalsModule,
    JournalCategoriesModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController, UserJournalsController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
