'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('articles', 'title', {
      type: Sequelize.STRING(255),
      allowNull: false
    });
    await queryInterface.addColumn('articles', 'content', {
      type: Sequelize.TEXT,
      allowNull: false
    });
    await queryInterface.addColumn('articles', 'published_date', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('articles', 'status', {
      type: Sequelize.INTEGER(4),
      allowNull: false,
      defaultValue: 1
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Add logic to revert the changes made in up function
  }
};
