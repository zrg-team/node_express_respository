'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'createdat');
    await queryInterface.removeColumn('users', 'updatedat');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'createdat', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('users', 'updatedat', {
      type: Sequelize.DATE,
      allowNull: true
    });
  }
};
