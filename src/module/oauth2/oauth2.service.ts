import { PrismaService } from '@/processor/database/prisma.service';
import { Logger, LoggerService } from '@/processor/log4j/log4j.service';
import { createServer, OAuth2Server } from 'oauth2orize';

/**
 * TODO:
 * · oauth2 数据库完成设计
 * · oauth2 完成验证流程
 * · oauth2 完成测试流程
 */
export class OAuth2Service {
  private oauthInstance: OAuth2Server;
  private log: Logger;

  constructor(
    private readonly logService: LoggerService,
    private readonly prismaService: PrismaService,
  ) {
    this.log = this.logService.getLogger(OAuth2Service.name);
    this.init();
    this.serializeClient();
  }

  init(): void {
    if (!this.oauthInstance) {
      this.oauthInstance = createServer();
    }
  }

  serializeClient() {
    this.oauthInstance.serializeClient((client, done) => {
      this.log.debug('serializeClient', client);
      return done(null, client.id);
    });
  }

  deserializeClient() {
    this.oauthInstance.deserializeClient((id, done) => {
      // this.prismaService.device.find;
      // db.clients.findById(id, (error, client) => {
      //   if (error) return done(error);
      //   return done(null, client);
      // });
    });
  }
}
