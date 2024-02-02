import { UserObject } from '@perspective/shared';
import { createFromClass } from 'src/core/utils/transformers.util';
import { UserEntity } from 'src/modules/users/entities/user.entity';

interface IUserTransformerData {
  userEntity: UserEntity;
  includePassword?: boolean;
  includeResetPasswordToken?: boolean;
}

/* This pattern lets us decide exactly what we want to expose within our business objects.
Imo returning entites directly is rarely (never) a good idea.*/
export function createUserObjectFromEntity(data: IUserTransformerData) {
  const {
    userEntity: {
      id,
      email,
      password,
      firstName,
      lastName,
      role,
      gender,
      birthDate,
      createdAt,
      updatedAt,
    },
    includePassword = false,
  } = data;

  return createFromClass(UserObject, {
    id,
    email,
    /*Most flexible way to handle the password exposure to outside world (or lack thereof).
    Not handling this directly in entity since We DO want to include the column when fetching from db,
    as pwd may be needed within internal functions (e.g. auth guards).*/
    password: includePassword ? password : undefined,
    firstName,
    lastName,
    role,
    gender,
    birthDate,
    createdAt,
    updatedAt,
  });
}
