'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comments', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      article_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: 'articles',
          key: 'id'
        }
      },
      user_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('comments');
  }
};
