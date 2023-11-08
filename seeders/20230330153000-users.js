'use strict';
const bcrypt = require('bcryptjs');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('defaultPassword', 10);
    return queryInterface.bulkInsert('users', [{
      user_name: 'admin',
      password: hashedPassword,
      status: 'ACTIVE',
      created_at: new Date(),
      updated_at: new Date(),
      avatar: null
    }, {
      user_name: 'user',
      password: hashedPassword,
      status: 'ACTIVE',
      created_at: new Date(),
      updated_at: new Date(),
      avatar: null
    }, {
      user_name: 'customer',
      password: hashedPassword,
      status: 'ACTIVE',
      created_at: new Date(),
      updated_at: new Date(),
      avatar: null
    }], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
