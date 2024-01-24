'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('articles', 'content', {
      type: Sequelize.TEXT,
      allowNull: false
    });
    await queryInterface.addColumn('articles', 'status', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('articles', 'userId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('articles', 'content');
    await queryInterface.removeColumn('articles', 'status');
    await queryInterface.removeColumn('articles', 'userId');
  }
};
