'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_types', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
    // Seed the user_types table with initial data
    await queryInterface.bulkInsert('user_types', [
      { code: 'ADMIN', title: 'Administrator' },
      { code: 'USER', title: 'Regular User' },
      // Add more user types here if necessary
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_types');
  }
};
