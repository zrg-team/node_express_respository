'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user_types', [{
      code: 'ADMIN',
      title: 'Administrator',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      code: 'USER',
      title: 'Regular User',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user_types', null, {});
  }
};
