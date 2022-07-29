import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    /*
    By putting data as never, the user will notified that they should not send any argument into the decorator.
    Execution context is used because the interceptor might receive http or gRPC or webSocket or graph ql
    request so to fetch in a unified platform, this is used.
    To accept HTTP -> switchToHTTP is used
    To accept gRPC -> switchToRPC is used and so on.
    */
    const request = context.switchToHttp().getRequest();
    const user = request.session.currentUser;
    return user;
  },
);
