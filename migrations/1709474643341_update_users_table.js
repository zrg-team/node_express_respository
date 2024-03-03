'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'user_type_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'user_types',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    await queryInterface.addColumn('users', 'avatar', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('users', 'avatar_file_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'files',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    await queryInterface.addColumn('users', 'name', {
      type: Sequelize.STRING
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'user_type_id');
    await queryInterface.removeColumn('users', 'avatar');
    await queryInterface.removeColumn('users', 'avatar_file_id');
    await queryInterface.removeColumn('users', 'name');
  }
};
