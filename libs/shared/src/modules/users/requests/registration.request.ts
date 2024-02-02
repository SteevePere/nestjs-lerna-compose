import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString
} from 'class-validator';

import { Match } from '../../../decorators/validation/match.decorator';
import { PasswordRequest } from '../../shared/requests/password.request';
import { UserGenderEnum } from '../enums/user-gender.enum';

export class RegistrationRequest extends PasswordRequest {
  @ApiProperty({
    description: 'First name of the future User',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the future User',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Email of the future User',
    example: 'johndoe@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password confirmation of the future User. Must match password',
    example: 'NeverGonnaGiveYouUp1234',
  })
  @IsString()
  @IsNotEmpty()
  @Match('password')
  passwordConfirm: string;

  @ApiProperty({
    description: 'Birth date of the future User',
    example: '1991-10-16T21:50:00.000Z',
  })
  @IsDateString()
  birthDate: string;

  @ApiProperty({
    enum: UserGenderEnum,
    description: 'Gender of the future User',
    example: UserGenderEnum.MALE,
  })
  @IsEnum(UserGenderEnum)
  gender: UserGenderEnum;
}