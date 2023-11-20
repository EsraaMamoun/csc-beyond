import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class APIKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { API_KEY } = process.env;

    const request = context.switchToHttp().getRequest();

    return (
      request?.headers?.api_key === API_KEY ||
      request?.headers['x-api-key'] === API_KEY
    );
  }
}
