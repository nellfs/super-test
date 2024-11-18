import { Test, TestingModule } from '@nestjs/testing';
import { StartedTestContainer } from 'testcontainers';

import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Sequelize } from 'sequelize-typescript';

describe('AppController (integration-test)', () => {
  let app: INestApplication;
  let container: StartedMySqlContainer;
  let sequelize: Sequelize;

  beforeAll(async () => {
    container = await new MySqlContainer().start();

    process.env.MYSQL_HOST = container.getHost();
    process.env.MYSQL_PORT = container.getPort().toString();
    process.env.MYSQL_USERNAME = container.getUsername();
    process.env.MYSQL_PASSWORD = container.getUserPassword();
    process.env.MYSQL_DATABASE = container.getDatabase();

    console.log(process.env.MYSQL_HOST, process.env.MYSQL_DATABASE, process.env.MYSQL_PASSWORD)

    sequelize = new Sequelize(
      container.getDatabase(),
      container.getUsername(),
      container.getUserPassword(),
      {
        host: container.getHost(),
        port: container.getPort(),
        dialect: 'mysql',
      },
    );

    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }, 60000);

  afterAll(async () => {
    await sequelize.close();
    await container.stop();
  });

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
