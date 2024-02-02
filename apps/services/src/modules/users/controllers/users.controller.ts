import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindUsersRequest,
  FindUsersResponse,
  PaginatedResponse,
  RegistrationRequest,
  RegistrationResponse,
  UserObject,
} from '@perspective/shared';
import { ApiPaginatedResponse } from 'src/core/decorators/api-paginated-response.decorator';
import { createFromClass } from 'src/core/utils/transformers.util';
import { RegistrationData } from '../dtos/register.dto';
import { UsersService } from '../services/users.service';

/* All data validation is handled by class-validator rules,
which are defined at the DTO level (DTOs are called "...Request" here, e.g. RegistrationRequest).
See libs/shared DTOs (libs/shared/src/modules/users/requests).*/
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(public usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a User' })
  @ApiCreatedResponse({
    type: RegistrationResponse,
  })
  async register(
    @Body() data: RegistrationRequest,
  ): Promise<RegistrationResponse> {
    const registerResult = await this.usersService.register(
      createFromClass(RegistrationData, {
        ...data,
      }),
    );

    return createFromClass(RegistrationResponse, { ...registerResult });
  }

  @Get()
  @ApiOperation({ summary: 'Find all Users' })
  @ApiExtraModels(PaginatedResponse) // This is needed so Swagger can find the PaginatedResponse model
  @ApiPaginatedResponse(UserObject)
  async findAll(
    @Query() findUsersData: FindUsersRequest,
  ): Promise<FindUsersResponse> {
    const { limit = 20, skip = 0 } = findUsersData;
    const { items, count } = await this.usersService.findAll(findUsersData);

    return createFromClass(FindUsersResponse, {
      limit,
      skip,
      count,
      items,
    });
  }
}
