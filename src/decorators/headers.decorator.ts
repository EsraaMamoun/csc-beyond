import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiSecurity } from '@nestjs/swagger';
import { accountType } from '@prisma/client';
import { CustomAuthGuard } from '../guards/auth.guard';

type Options = {
  withAuth?: boolean;
  withDevice?: boolean;
  withAdminRole?: boolean;
  extend?: Array<'AUTH'>;
};

export const ApiHeaders = (options?: Options) => {
  const {
    withAuth = false,
    withDevice = true,
    withAdminRole = false,
    extend = [],
  } = options || {};

  if (extend.includes('AUTH')) {
    return applyDecorators(ApiBearerAuth(), UseGuards(CustomAuthGuard));
  }

  let decorators = applyDecorators(
    ApiHeader({
      name: 'X-VERSION',
      description: 'Application Version',
      required: false,
      schema: {
        default: '1.0.0',
      },
    }),
    ApiHeader({
      name: 'X-TYPE',
      description: 'Current Account Type',
      enum: accountType,
      required: true,
      schema: {
        default: accountType.user,
      },
    }),
    ApiSecurity('X-API-KEY'),
  );

  decorators = withAuth
    ? applyDecorators(decorators, ApiBearerAuth(), UseGuards(CustomAuthGuard))
    : decorators;

  decorators = withDevice
    ? applyDecorators(
        decorators,
        ApiHeader({
          name: 'X-DEVICE',
          description: 'Current Device ID',
          required: true,
        }),
      )
    : decorators;

  return decorators;
};
