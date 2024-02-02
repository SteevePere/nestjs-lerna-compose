import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator';

export class BaseEntityObject {
  @ApiPropertyOptional({
    description: 'Internal id of the Entity',
    example: 'ab321168-945d-42fc-afdb-0efec1e3dedf',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({
    description: 'Creation date of the Entity',
    example: '1991-10-16T21:50:00.000Z',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  createdAt?: Date;

  @ApiPropertyOptional({
    description: 'Last update date of the Entity',
    example: '1994-09-28T21:53:00.000Z',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  updatedAt?: Date;
}