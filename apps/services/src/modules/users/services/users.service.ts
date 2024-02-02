import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { createFromClass } from 'src/core/utils/transformers.util';
import { Repository } from 'typeorm';
import { FindUsersData, FindUsersResult } from '../dtos/find-users.dto';
import { RegistrationData, RegistrationResult } from '../dtos/register.dto';
import { UserEntity } from '../entities/user.entity';
import { createUserObjectFromEntity } from '../transformers/user-object.transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async register(data: RegistrationData): Promise<RegistrationResult> {
    /*About error handling: Nest catches all errors and throws a default 500 HTTP with explicit message.
    The only case we might want to handle ourselves here is email unicity (guaranteed by unicity constraint in entity).
    The potential error is handled by TypeOrmConflictErrorInterceptor (src/core/interceptors).
    Therefore no need for a try catch block here.*/
    data.password = await this.hashPassword(data.password);
    const userToSave = this.usersRepository.create({ ...data });
    const newUser = await this.usersRepository.save(userToSave);

    return {
      user: createUserObjectFromEntity({
        userEntity: newUser,
      }),
    };
  }

  async findAll(findUsersData: FindUsersData): Promise<FindUsersResult> {
    const { limit = 10, skip = 0, created: createdAt } = findUsersData;
    const [users, count] = await this.usersRepository.findAndCount({
      order: {
        /*No need to handle case where optional query param is undefined,
        ORDER BY clause is simply not generated if undefined.*/
        createdAt,
      },
      take: limit,
      skip,
    });
    const items = users.map((user) =>
      createUserObjectFromEntity({ userEntity: user }),
    );

    return createFromClass(FindUsersResult, {
      items,
      count,
      limit,
      skip,
    });
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
