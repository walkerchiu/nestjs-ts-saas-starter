import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import * as classValidator from 'class-validator';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';

jest.mock('bcrypt');
jest.mock('class-validator');

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  // Create a mock for UserRepository
  const mockUserRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);

    jest.clearAllMocks();
    (classValidator.validate as jest.Mock).mockResolvedValue([]);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('list', () => {
    it('should retrieve a list of users', async () => {
      const result: UserEntity[] = [];
      jest.spyOn(userService, 'list').mockResolvedValue(result);

      expect(await userController.index()).toBe(result);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('authenticate', () => {
    it('should return authenticated user when credentials are correct', async () => {
      const inputUser = {
        email: 'test@email.com',
        password: 'testPassword',
      };
      const returnedUser: UserEntity = {
        id: 'some-id',
        email: inputUser.email,
        name: 'Test Name',
        password: 'hashedPassword',
      } as UserEntity;

      mockUserRepository.findByEmail.mockResolvedValue(returnedUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      expect(await userController.authenticate(inputUser)).toEqual(
        returnedUser,
      );
    });

    it('should throw a descriptive BadRequestException when input validation fails', async () => {
      const inputUser = {
        email: 'test',
        password: 'short',
      };

      (classValidator.validate as jest.Mock).mockResolvedValue([{}]);

      await expect(userController.authenticate(inputUser)).rejects.toThrowError(
        new BadRequestException([{}]),
      );
    });

    it('should return null for incorrect credentials', async () => {
      const inputUser = {
        email: 'test@email.com',
        password: 'wrongPassword', // 假定密碼是錯誤的
      };

      // 這裡假設 bcrypt.compare 返回 false，表示身份驗證失敗
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      expect(await userController.authenticate(inputUser)).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const inputUser = {
        name: 'Test Name',
        email: 'test@email.com',
        password: 'testPassword',
      };
      const savedUser = {
        ...inputUser,
        id: 'some-id',
        password: 'hashedPassword',
      } as UserEntity;

      mockUserRepository.save.mockResolvedValue(savedUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      expect(await userController.create(inputUser)).toEqual(savedUser);
    });

    it('should throw BadRequestException when validation fails', async () => {
      const invalidUser = {
        name: '',
        email: 'test',
        password: 'short',
      };

      (classValidator.validate as jest.Mock).mockResolvedValue([{}]);

      await expect(userController.create(invalidUser)).rejects.toThrowError(
        new BadRequestException([{}]),
      );
    });

    it('should throw an error when bcrypt.hash fails', async () => {
      const inputUser = {
        name: 'Test Name',
        email: 'test@email.com',
        password: 'testPassword',
      };

      // 這裡假設 bcrypt.hash 會拋出錯誤
      (bcrypt.hash as jest.Mock).mockRejectedValue(
        new Error('Bcrypt hashing failed'),
      );

      await expect(userController.create(inputUser)).rejects.toThrowError(
        'Bcrypt hashing failed',
      );
    });
  });

  describe('show', () => {
    it('should return a user based on ID', async () => {
      const userId = 'some-id';
      const expectedUser: UserEntity = {
        id: userId,
        name: 'Test Name',
        email: 'test@email.com',
        password: 'hashedPassword',
      } as UserEntity;

      mockUserRepository.findOne.mockResolvedValue(expectedUser);

      expect(await userController.show(userId)).toEqual(expectedUser);
    });

    it('should return null if user is not found', async () => {
      const userId = 'some-nonexistent-id';

      mockUserRepository.findOne.mockResolvedValue(undefined);

      expect(await userController.show(userId)).toBeUndefined();
    });
  });
});
