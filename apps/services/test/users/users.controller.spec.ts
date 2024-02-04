import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  FindUsersRequest,
  FindUsersResponse,
  RegistrationRequest,
  RegistrationResponse,
  SortOrderEnum,
  UserGenderEnum,
  UserRoleEnum,
} from '@perspective/shared';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { createFromClass } from '../../src/core/utils/transformers.util';
import { UsersController } from '../../src/modules/users/controllers/users.controller';
import { UsersService } from '../../src/modules/users/services/users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const mockUserData: Partial<UserEntity> = {
      id: 'ab321168-945d-42fc-afdb-0efec1e3dedf',
      createdAt: new Date(),
      updatedAt: new Date(),
      email: 'john.doe@example.com',
      password: 'hashedPassword',
      birthDate: new Date('1990-01-01'),
      gender: UserGenderEnum.MALE,
      role: UserRoleEnum.ADMIN,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          // Mocking repository Provider
          provide: getRepositoryToken(UserEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(mockUserData),
            find: jest.fn().mockResolvedValue([mockUserData]),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('register', () => {
    it('should create a User and return a RegistrationResponse', async () => {
      const registrationRequest: RegistrationRequest = {
        password: 'NeverGonnaGiveYouUp1234',
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        passwordConfirm: 'NeverGonnaGiveYouUp1234',
        birthDate: '1991-10-16T21:50:00.000Z',
        gender: UserGenderEnum.MALE,
      };

      const registrationResponse: RegistrationResponse = {
        user: {
          id: 'ab321168-945d-42fc-afdb-0efec1e3dedf',
          createdAt: new Date(),
          updatedAt: new Date(),
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@gmail.com',
          birthDate: new Date(),
          gender: UserGenderEnum.MALE,
          role: UserRoleEnum.USER,
        },
      };

      jest
        .spyOn(usersService, 'register')
        .mockResolvedValue(
          createFromClass(RegistrationResponse, registrationResponse),
        );

      const result = await controller.register(registrationRequest);

      expect(result).toEqual(registrationResponse);
    });
  });

  describe('findAll', () => {
    it('should find all Users, paginated', async () => {
      const items = [
        {
          id: '2228324c-0a38-49da-a808-6be3012a9235',
          email: 'johndoe@gmail.com',
          firstName: 'John',
          lastName: 'Doe',
          role: UserRoleEnum.USER,
          gender: UserGenderEnum.MALE,
          birthDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const findUsersRequest: FindUsersRequest = {
        created: SortOrderEnum.ASC,
      };

      const findUsersResponse: FindUsersResponse = {
        items,
        count: 1,
        limit: 20,
        skip: 0,
      };

      jest.spyOn(usersService, 'findAll').mockResolvedValue({
        items,
        count: 1,
        limit: 20,
        skip: 0,
      }); // Mocking the service response

      const result = await controller.findAll(findUsersRequest);

      expect(result).toEqual(findUsersResponse);
    });
  });
});
