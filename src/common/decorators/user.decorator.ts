import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../database/models/user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.data;
  },
);
