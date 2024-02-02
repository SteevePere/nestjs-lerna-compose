import { plainToClass } from 'class-transformer';

export declare type ClassConstructor<T> = {
  new (...args: unknown[]): T;
};

// Leverages plainToClass to tranform plain objects into class instances (has several potential benefits).
export function createFromClass<T>(cls: ClassConstructor<T>, plain: T): T {
  return plainToClass(cls, plain);
}
