'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('articles', 'title', {
      type: Sequelize.STRING(255),
      allowNull: false
    });
    await queryInterface.addColumn('articles', 'description', {
      type: Sequelize.STRING(255),
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('articles', 'description');
  }
};
