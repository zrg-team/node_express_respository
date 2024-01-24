'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'user_name', {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true
    });
    await queryInterface.removeColumn('users', 'user_type_id');
    await queryInterface.removeColumn('users', 'avatar_file_id');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'user_name', {
      type: Sequelize.STRING(256),
      allowNull: false,
      unique: true
    });
    // Note: The down migration does not restore the removed columns.
  }
};
