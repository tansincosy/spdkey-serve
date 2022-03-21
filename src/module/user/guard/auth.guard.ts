import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as OAuth2 from 'oauth2-server';
import { AuthService } from '../service/auth.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    try {
      await this.authService
        .getOAuthClient()
        .authenticate(
          new OAuth2.Request(request),
          new OAuth2.Response(response),
        );
    } catch (error) {
      throw error;
    }

    return true;
  }
}
