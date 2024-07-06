import { Module } from '@nestjs/common';
import { FilterModule } from './filter/filter.module';
import { ErrorHandlingModule } from './error-handling/error-handling.module';
import { SortModule } from './sort/sort.module';

@Module({
  imports: [FilterModule, SortModule, ErrorHandlingModule],
  exports: [FilterModule, SortModule, ErrorHandlingModule],
})
export class SharedModule {}
