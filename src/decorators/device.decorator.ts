import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ErrorsEnum } from '../enums/errors.enum';

export const CurrentDevice = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!request?.headers?.device_id && !request?.headers['x-device']) {
      throw new Error(ErrorsEnum.device_not_found);
    }

    return request.headers.device_id || request?.headers['x-device'];
  },
);
