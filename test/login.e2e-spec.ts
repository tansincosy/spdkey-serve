import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

/**
 * notice:
 * TODO: 【1】：用户登录
 *             用户登录
 *                   设置refresh access
 *                       if autologin by refreshToken --> access [remove old refresh]
 *                          else access
 *                          if access expire -> by refresh get access [remove old refresh]
 *        【2】：用户注册
 *               enter username passwd and email then by email code get visible
 *        【3】：用户改密码
 *              enter email code target modify passwd website
 *        【4】： 用户注销
 *               user logout -> remove refresh and access
 */

describe('login (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
