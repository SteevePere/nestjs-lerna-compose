import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponse<T> {
  @ApiProperty({
    description: 'Array of results',
  })
  items: T[];

  @ApiProperty({
    description: 'Total number of results',
    example: 3,
  })
  count: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 1,
  })
  limit: number;

  @ApiProperty({
    description: 'Number of pages skipped',
    example: 1,
  })
  skip: number;
}
