import { execSync } from 'child_process';
import { Sequelize } from 'sequelize-typescript';
import { StudentDto } from '../students/dto/student.dto';
import { ClassDto, CreateClassDto } from '../classes/dto/class.dto';

interface ITemplateDatabase {
  students: StudentDto[];
  classes: ClassDto[];
}

const now = new Date();

export const TEST_CLASSES: CreateClassDto[] = [
  {
    name: 'Test class 01',
    description: 'description 1',
    start_date: now,
    end_date: null,
  },
  {
    name: 'Test class 02',
    description: 'description 2',
    start_date: now,
    end_date: null,
  },
  {
    name: 'Test class 03',
    description: 'description 3',
    start_date: now,
    end_date: null,
  },
];

export const TEST_STUDENTS = [
  {
    first_name: 'Heron',
    last_name: 'X',
    email: 'herontest@email.com',
    date_of_birth: '2002-08-08',
  },
  {
    first_name: 'Dio',
    last_name: 'Dio',
    email: 'diotest@email.com',
    date_of_birth: '2001-03-20',
  },
  {
    first_name: 'Ricardo',
    last_name: 'A',
    email: 'ricardotest@email.com',
    date_of_birth: '1999-11-05',
  },
];

export const TEST_ENROLLMENTS = [
  { student_id: 1, class_id: 1 },
  { student_id: 2, class_id: 2 },
  { student_id: 2, class_id: 3 },
  { student_id: 3, class_id: 1 },
];

export async function setupTestDatabase(sequelize: Sequelize) {
  const { database, username, password, host, port } = sequelize.config;
  const url = `mysql://${username}:${password}@${host}:${port}/${database}`;

  execSync(`npx sequelize-cli db:migrate --url '${url}'`);

  // classes setup
  const values = TEST_CLASSES.map(
    (classItem) =>
      `('${classItem.name}', '${classItem.description}', NOW(), NULL, NOW(), NOW())`,
  ).join(', ');

  await sequelize.query(`
    INSERT INTO Classes (name, description, start_date, end_date, created_at, updated_at)
    VALUES
      ${values}
  `);

  // student setup
  const studentValues = TEST_STUDENTS.map(
    (student) =>
      `('${student.first_name}', '${student.last_name}', '${student.email}', '${student.date_of_birth}', NOW(), NOW())`,
  ).join(', ');

  await sequelize.query(`
    INSERT INTO Students (first_name, last_name, email, date_of_birth, created_at, updated_at)
    VALUES
      ${studentValues}
  `);

  // enrollment setup
  const enrollmentValues = TEST_ENROLLMENTS.map(
    (enrollment) => `(${enrollment.student_id}, ${enrollment.class_id})`,
  ).join(', ');

  await sequelize.query(`
    INSERT INTO StudentClasses (student_id, class_id)
    VALUES
      ${enrollmentValues}
  `);
}
