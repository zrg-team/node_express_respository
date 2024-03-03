'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'name', {
      type: Sequelize.STRING(256),
      allowNull: true
    });
    // Add other new columns here if necessary
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'name');
    // Remove other new columns here if necessary
  }
};
