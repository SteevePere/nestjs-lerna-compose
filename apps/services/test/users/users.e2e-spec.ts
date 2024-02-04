import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  FindUsersResponse,
  SortOrderEnum,
  UserGenderEnum,
  UserObject,
  UserRoleEnum,
} from '@perspective/shared';
import { nanoid } from 'nanoid';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let createdUserEmail: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(); // Mocking the whole application
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users/register (POST)', async () => {
    /*Ensuring unicity with this trick.
    (I should really be using a temporary in-memory db instead, but a bit too long to setup)*/
    createdUserEmail = `${nanoid()}@gmail.com`;

    const registrationRequest = {
      password: 'NeverGonnaGiveYouUp1234', // At what point does this start counting as a rickroll?
      firstName: 'John',
      lastName: 'Doe',
      email: createdUserEmail,
      passwordConfirm: 'NeverGonnaGiveYouUp1234',
      birthDate: '1991-10-16T21:50:00.000Z',
      gender: UserGenderEnum.MALE,
    };

    const response = await request(app.getHttpServer())
      .post('/users/register')
      .send(registrationRequest)
      .expect(201);

    const expectedResponse = {
      user: {
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        firstName: 'John',
        lastName: 'Doe',
        email: createdUserEmail,
        birthDate: expect.any(String),
        gender: UserGenderEnum.MALE,
        role: UserRoleEnum.USER,
      },
    };

    expect(response.body).toEqual(expectedResponse);
  });

  it('/users (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .query({ created: SortOrderEnum.ASC })
      .expect(200);

    const findUsersResponse: FindUsersResponse = response.body;

    expect(findUsersResponse).toHaveProperty('items');
    expect(findUsersResponse).toHaveProperty('count');
    expect(findUsersResponse).toHaveProperty('limit');
    expect(findUsersResponse).toHaveProperty('skip');

    const createdUserExists = findUsersResponse.items.some(
      (user: UserObject) => user.email === createdUserEmail,
    );

    expect(createdUserExists).toBe(true);
  });
});
