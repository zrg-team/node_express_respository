'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      user_name: 'First User',
      password: 'password',
      status: 'active',
      createdat: new Date(),
      updatedat: new Date(),
      avatar: 'default.jpg',
      avatar_file_id: 1,
      username: 'firstuser',
      name: 'First User'
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', { id: { [Sequelize.Op.in]: [1] } }, {})
  }
}
