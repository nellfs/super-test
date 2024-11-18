import { execSync } from 'child_process';
import { Sequelize } from 'sequelize-typescript';

export async function setupTestDatabase(sequelize: Sequelize) {
  const { database, username, password, host, port } = sequelize.config;
  const url = `mysql://${username}:${password}@${host}:${port}/${database}`;

  execSync(`npx sequelize-cli db:migrate --url '${url}'`);

  await sequelize.query(`
    INSERT INTO Students (first_name, last_name, email, date_of_birth, created_at, updated_at)
    VALUES
      ('Heron', 'X', 'herontest@email.com', '2002-08-08', NOW(), NOW()),
      ('Dio', 'Dio', 'diotest@email.com', '2001-03-20', NOW(), NOW()),
      ('Ricardo', 'A', 'ricardotest@email.com', '1999-11-05', NOW(), NOW())
  `);

  // classes setup
  await sequelize.query(`
      INSERT INTO Classes (name, description, start_date, end_date, created_at, updated_at)
      VALUES
        ('Test class 01', 'description 1', NOW(), NULL, NOW(), NOW()),
        ('Test class 02', 'description 2', NOW(), NULL, NOW(), NOW()),
        ('Test class 03', 'description 3', NOW(), NULL, NOW(), NOW())
    `);

  // enrollment setup
  await sequelize.query(`
    INSERT INTO StudentClasses (student_id, class_id)
    VALUES
      (1, 1),
      (2, 2),
      (2, 3)
      (3, 1),
  `);
}
