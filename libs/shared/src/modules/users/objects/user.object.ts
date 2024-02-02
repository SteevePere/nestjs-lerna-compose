import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';

import { BaseEntityObject } from '../../shared/objects/base-entity.object';
import { UserGenderEnum } from '../enums/user-gender.enum';
import { UserRoleEnum } from '../enums/user-role.enum';

export class UserObject extends BaseEntityObject {
  @ApiProperty({
    description: 'First name of the User',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the User',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Email of the User',
    example: 'johndoe@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Password of the User',
    example: 'NeverGonnaGiveYouUp1234',
    writeOnly: true,
  })
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'Birth date of the User',
    example: '1991-10-16T21:50:00.000Z',
  })
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;

  @ApiProperty({
    enum: UserGenderEnum,
    description: 'Gender of the User',
    example: UserGenderEnum.MALE,
  })
  @IsEnum(UserGenderEnum)
  gender: UserGenderEnum;

  @ApiProperty({
    enum: UserRoleEnum,
    description: 'Gender of the User',
    example: UserRoleEnum.USER,
  })
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;
}