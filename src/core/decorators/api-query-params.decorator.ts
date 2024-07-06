import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

/**
 * Combines multiple Swagger ApiQuery decorators into a single decorator
 * @param params list of the query parameters
 * @returns a new decorator
 */
export const ApiQueryParams = (...params: string[]) => {
  return applyDecorators(
    ...params.map((param) => ApiQuery({ name: param, required: false })),
  );
};
