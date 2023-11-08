'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert seed data into 'users' table
    await queryInterface.bulkInsert('users', [
      {
        user_name: 'admin',
        password: 'hashed_password', // Replace with actual hashed password
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
        avatar: 'default_admin_avatar.png'
      },
      {
        user_name: 'user1',
        password: 'hashed_password', // Replace with actual hashed password
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
        avatar: 'default_user_avatar.png'
      },
      {
        user_name: 'customer1',
        password: 'hashed_password', // Replace with actual hashed password
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
        avatar: 'default_customer_avatar.png'
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    // Remove the inserted data from 'users' table
    await queryInterface.bulkDelete('users', null, {});
  }
};
