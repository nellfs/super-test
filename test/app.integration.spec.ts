import { Test, TestingModule } from '@nestjs/testing';

import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Sequelize } from 'sequelize-typescript';
import {
  setupTestDatabase,
  TEST_CLASSES,
  TEST_STUDENTS,
} from '../src/utils/setup_database';
import { SUCCESS_MESSAGES } from '../src/constants/messages.constants';
import { ClassDto, UpdateClassDTO } from 'src/classes/dto/class.dto';
import { EnrollStudentsDto } from 'src/student_class/dto/student-class.dto';
import { UpdateStudentDto } from 'src/students/dto/student.dto';

describe('AppController (All Routes)', () => {
  let app: INestApplication;
  let container: StartedMySqlContainer;
  let sequelize: Sequelize;

  beforeAll(async () => {
    container = await new MySqlContainer().start();

    // oi!! this is silly, container configuration cannot be set in nest configuration
    // so I am overwriting the enviroment in integration tests

    // also, please note that this integration test does not restart the database for every test
    // I am manipulating data here, neither the container or the database are isolated by default :-)

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

  describe('Classes Test', () => {
    describe('GET /classes (with limit)', () => {
      it('should return a page of classes', async () => {
        const response = await request(app.getHttpServer())
          .get('/classes?limit=100&page=1')
          .expect(200);

        console.log(response.body);

        expect(response.body.items).toHaveLength(TEST_CLASSES.length);

        response.body.items.forEach((classItem: ClassDto) => {
          expect(classItem).toEqual({
            id: expect.any(Number),
            name: expect.any(String),
            description: expect.any(String),
            start_date: expect.any(String),
            end_date: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          });
        });

        TEST_CLASSES.forEach((_, index) => {
          expect(response.body.items[index].name).toBe(
            TEST_CLASSES[index].name,
          );
          expect(response.body.items[index].description).toBe(
            TEST_CLASSES[index].description,
          );
        });
      });
    });

    describe('GET /classes/:id', () => {
      it('should return just one class', async () => {
        const response = await request(app.getHttpServer())
          .get('/classes/1')
          .expect(200);

        expect(response.body).toEqual({
          id: expect.any(Number),
          name: expect.any(String),
          description: expect.any(String),
          start_date: expect.any(String),
          end_date: null,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
        });

        expect(response.body.name).toBe(TEST_CLASSES[0].name);
        expect(response.body.description).toBe(TEST_CLASSES[0].description);
      });
    });

    describe('POST /classes', () => {
      it('should create a class and return it', async () => {
        const request_body = {
          name: 'Created class',
          description: 'created description',
          start_date: '2020-10-10',
          end_date: '2025-10-10',
        };

        const expectedResponse = {
          ...request_body,
          start_date: '2020-10-10T00:00:00.000Z',
          end_date: '2025-10-10T00:00:00.000Z',
        };

        const response = await request(app.getHttpServer())
          .post('/classes')
          .send(request_body)
          .expect(201);

        expect(response.body.name).toBe(expectedResponse.name);
        expect(response.body.description).toBe(expectedResponse.description);
        expect(response.body.start_date).toBe(expectedResponse.start_date);
        expect(response.body.end_date).toBe(expectedResponse.end_date);
      });
    });

    describe('DELETE /classes', () => {
      it('should delete one class', async () => {
        const response = await request(app.getHttpServer())
          .delete('/classes/1')
          .expect(200);

        expect(response.body.message).toBe(SUCCESS_MESSAGES.CLASS_REMOVED);
      });
    });

    describe('PATCH /classes/:id', () => {
      it('should update one class', async () => {
        const updated_class: UpdateClassDTO = {
          name: 'edited name',
          description: 'edited description',
        };

        const response = await request(app.getHttpServer())
          .patch('/classes/2')
          .send(updated_class)
          .expect(200);

        expect(response.body.name).toBe(updated_class.name);
        expect(response.body.description).toBe(updated_class.description);
      });
    });

    describe('POST /classes/:id/enroll', () => {
      it('should update one class', async () => {
        const stundents_enroll: EnrollStudentsDto = {
          students: [1, 2],
        };

        const response = await request(app.getHttpServer())
          .post('/classes/1/enroll')
          .send(stundents_enroll)
          .expect(201);

        expect(response.body.message).toBe(SUCCESS_MESSAGES.STUDENTS_ENROLLED);
      });
    });
  });

  describe('Students Test', () => {
    describe('GET /students (with limits)', () => {
      it('should return a page of students', async () => {
        const response = await request(app.getHttpServer())
          .get('/students?limit=100')
          .expect(200);

        expect(response.body.items).toHaveLength(TEST_CLASSES.length);

        response.body.items.forEach((classItem: ClassDto) => {
          expect(classItem).toEqual({
            id: expect.any(Number),
            first_name: expect.any(String),
            last_name: expect.any(String),
            email: expect.any(String),
            date_of_birth: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          });
        });

        TEST_STUDENTS.forEach((_, index) => {
          expect(response.body.items[index].first_name).toBe(
            TEST_STUDENTS[index].first_name,
          );
          expect(response.body.items[index].last_name).toBe(
            TEST_STUDENTS[index].last_name,
          );
          expect(response.body.items[index].email).toBe(TEST_STUDENTS[index].email);
        });
      });
    });

    describe('GET /students/:id', () => {
      it('should return just one student', async () => {
        const response = await request(app.getHttpServer())
          .get('/students/1')
          .expect(200);

        expect(response.body).toEqual({
          id: expect.any(Number),
          first_name: expect.any(String),
          last_name: expect.any(String),
          email: expect.any(String),
          date_of_birth: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
        });

        expect(response.body.first_name).toBe(TEST_STUDENTS[0].first_name);
        expect(response.body.last_name).toBe(TEST_STUDENTS[0].last_name);
        expect(response.body.email).toBe(TEST_STUDENTS[0].email);
      });
    });

    describe('POST /students', () => {
      it('should create a class and return it', async () => {
        const request_body = {
          first_name: 'Created student',
          last_name: 'last name',
          email: 'teststudent@email.com',
          date_of_birth: '2012-10-10',
        };

        const expectedResponse = {
          ...request_body,
          date_of_birth: '2012-10-10T00:00:00.000Z',
        };

        const response = await request(app.getHttpServer())
          .post('/students')
          .send(request_body)
          .expect(201);

        expect(response.body.first_name).toBe(expectedResponse.first_name);
        expect(response.body.last_name).toBe(expectedResponse.last_name);
        expect(response.body.email).toBe(expectedResponse.email);
        expect(response.body.date_of_birth).toBe(
          expectedResponse.date_of_birth,
        );
      });
    });

    describe('DELETE /students', () => {
      it('should delete one student', async () => {
        const response = await request(app.getHttpServer())
          .delete('/students/1')
          .expect(200);

        expect(response.body.message).toBe(SUCCESS_MESSAGES.STUDENT_REMOVED);
      });
    });

    describe('PATCH /students/:id', () => {
      it('should update one student', async () => {
        const updated_class: UpdateStudentDto = {
          first_name: 'edited name',
          last_name: 'edited last name',
          email: 'edited email',
        };

        const response = await request(app.getHttpServer())
          .patch('/students/2')
          .send(updated_class)
          .expect(200);

        expect(response.body.first_name).toBe(updated_class.first_name);
        expect(response.body.last_name).toBe(updated_class.last_name);
        expect(response.body.email).toBe(updated_class.email);
      });
    });

    describe('GET /students/:id/classes', () => {
      it('should lits all classes of an student', async () => {
        const response = await request(app.getHttpServer())
          .get('/students/2/classes')
          .expect(200);

        expect(response.body[1].name).toBe(TEST_CLASSES[2].name);
        expect(response.body[1].description).toBe(TEST_CLASSES[2].description);
      });
    });
  });
});
