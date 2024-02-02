import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { QueryFailedError } from 'typeorm';

/*This generic global interceptor catches unicity Postgres driver errors on INSERT attempts
and wraps them as a 409 HTTP response with a dynamic message.
This means we do not need to always try to fetch exiting entities
and check manually whether unicity constraints are respected within business logic, nor handle this case
every time within catch() blocks.
Once a unicity constraint is defined for a column / entity field, this interceptor does the rest.*/
@Injectable()
export class TypeOrmConflictErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (
          error instanceof QueryFailedError &&
          error.driverError?.code === '23505' // This is the Postgres duplicate key error code
        ) {
          throw new ConflictException(error.driverError?.detail);
        } else {
          throw error;
        }
      }),
    );
  }
}
