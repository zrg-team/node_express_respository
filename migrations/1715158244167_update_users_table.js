
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'email', {
      type: Sequelize.STRING(256),
      allowNull: false,
      unique: true
    });
    await queryInterface.addColumn('users', 'avatar', {
      type: Sequelize.STRING(256),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'email');
    await queryInterface.removeColumn('users', 'avatar');
  }
};
