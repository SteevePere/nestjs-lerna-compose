import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginatedRequest {
  @ApiPropertyOptional({
    minimum: 0,
    default: 0,
    description: 'Number of items to skip',
    example: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  skip?: number;

  @ApiPropertyOptional({
    default: 10,
    description: 'Number of items to take',
    example: 10,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  limit?: number;
}
