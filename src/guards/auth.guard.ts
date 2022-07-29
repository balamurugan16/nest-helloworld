import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

// guards will first conduct a check whether the request can pass through the applied class
// guards can be applied in application wide, controller level and even handler level
// if the guard fails, 403 FORBIDDEN response will be returned.
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return request.session.userId;
  }
}
