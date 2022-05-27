import { Logger, LoggerService } from '@/processor/log4j/log4j.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as OAuth2Strategy from 'passport-oauth2';
import { AuthService } from './auth.service';
//oauth2orize
@Injectable()
export class AuthOAuthStrategy extends PassportStrategy(OAuth2Strategy) {
  private log: Logger;
  constructor(
    private authService: AuthService,
    private readonly logger: LoggerService,
  ) {
    super({
      authorizationURL: 'https://www.example.com/oauth2/authorize',
      tokenURL: 'https://www.example.com/oauth2/token',
      clientID: 'EXAMPLE_CLIENT_ID',
      clientSecret: 'EXAMPLE_CLIENT_SECRET',
      callbackURL: 'http://localhost:3000/auth/example/callback',
    });
    this.log = this.logger.getLogger(AuthOAuthStrategy.name);
  }

  async validate(accessToken, refreshToken, profile): Promise<any> {
    this.log.info(accessToken, refreshToken, profile);
    return {};
  }
}
