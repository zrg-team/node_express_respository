'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('articles', 'title', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('articles', 'summary', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('articles', 'content', {
      type: Sequelize.TEXT,
      allowNull: false
    });
    await queryInterface.addColumn('articles', 'publication_date', {
      type: Sequelize.DATE,
      allowNull: false
    });
    await queryInterface.addColumn('articles', 'category', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('articles', 'title');
    await queryInterface.removeColumn('articles', 'summary');
    await queryInterface.removeColumn('articles', 'content');
    await queryInterface.removeColumn('articles', 'publication_date');
    await queryInterface.removeColumn('articles', 'category');
  }
};
