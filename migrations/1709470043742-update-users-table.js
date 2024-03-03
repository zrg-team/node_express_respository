'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'avatar', {
      type: Sequelize.STRING(256),
      allowNull: true
    });
    await queryInterface.addColumn('users', 'name', {
      type: Sequelize.STRING(256),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'avatar');
    await queryInterface.removeColumn('users', 'name');
  }
};
