'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      title: {
        type: Sequelize.STRING
      },
      // ... other columns as per the "# TABLE" section
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('articles');
  }
};
