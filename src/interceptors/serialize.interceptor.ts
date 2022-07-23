import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private DTO: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // run something before the request is hangled by request handler
    // console.log('I am running before handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        // run somwthing after handling request
        // console.log('I am running after handling response');
        return plainToClass(this.DTO, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
