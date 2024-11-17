'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'StudentClasses',
      {
        student_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Students',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        class_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Classes',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      {
        timestamps: false,
      },
    );

    await queryInterface.addConstraint('StudentClasses', {
      fields: ['student_id', 'class_id'],
      type: 'unique',
      name: 'unique_student_class_pair',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('StudentClasses');
  },
};
