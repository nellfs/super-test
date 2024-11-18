import { Test, TestingModule } from '@nestjs/testing';
import { StartedTestContainer } from 'testcontainers';

import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Sequelize } from 'sequelize-typescript';
import { setupTestDatabase } from '../src/utils/setup_database';

describe('AppController (integration-test)', () => {
  let app: INestApplication;
  let container: StartedMySqlContainer;
  let sequelize: Sequelize;

  beforeAll(async () => {
    container = await new MySqlContainer().start();

    // oi!! this is silly, container configuration can not be set in nest configuration
    // so I am overwriting the enviroment by in integration tests

    process.env.MYSQL_HOST = container.getHost();
    process.env.MYSQL_PORT = container.getPort().toString();
    process.env.MYSQL_USERNAME = container.getUsername();
    process.env.MYSQL_PASSWORD = container.getUserPassword();
    process.env.MYSQL_DATABASE = container.getDatabase();

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
      await setupTestDatabase(sequelize);
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

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
