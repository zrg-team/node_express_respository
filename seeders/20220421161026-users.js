'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      user_name: 'admin',
      password: bcrypt.hashSync('admin', 10),
      createdat: new Date(),
      updatedat: new Date(),
      status: 2,
      avatar: null,
      avatar_file_id: null,
      name: 'Admin User'
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', { user_name: { [Sequelize.Op.eq]: 'admin' } }, {})
  }
}
