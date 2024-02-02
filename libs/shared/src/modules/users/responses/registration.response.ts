import { ApiProperty } from '@nestjs/swagger';
import { IsObject, ValidateNested } from 'class-validator';

import { UserObject } from '../objects/user.object';

export class RegistrationResponse {
  @ApiProperty({
    description: 'Authenticated User',
  })
  @IsObject()
  @ValidateNested()
  user: UserObject;
}
