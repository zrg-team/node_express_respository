'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      user_name: 'John Doe',
      password: 'password',
      status: 'active',
      createdat: new Date(),
      updatedat: new Date(),
      avatar: 'default.jpg',
      avatar_file_id: 1,
      username: 'johndoe'
    }, {
      user_name: 'Jane Doe',
      password: 'password',
      status: 'active',
      createdat: new Date(),
      updatedat: new Date(),
      avatar: 'default.jpg',
      avatar_file_id: 2,
      username: 'janedoe'
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', {
      id: {
        [Sequelize.Op.in]: [1, 2]
      }
    }, {})
  }
}
