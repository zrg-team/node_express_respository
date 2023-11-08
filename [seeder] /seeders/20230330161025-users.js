'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Since we are dealing with users, we need to hash passwords before inserting them
    // Assuming we have a utility function for hashing passwords (e.g., hashPassword)
    const bcrypt = require('bcryptjs');
    // Helper function to hash passwords
    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    };
    // Example user data
    const users = [
      {
        user_name: 'admin_user',
        password: await hashPassword('admin123'), // Hashed password
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
        avatar: 'admin_avatar.png'
      },
      {
        user_name: 'regular_user',
        password: await hashPassword('user123'), // Hashed password
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
        avatar: 'user_avatar.png'
      },
      {
        user_name: 'customer_user',
        password: await hashPassword('customer123'), // Hashed password
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
        avatar: 'customer_avatar.png'
      }
    ];
    // Insert users into the database
    return queryInterface.bulkInsert('users', users, {});
  },
  down: (queryInterface, Sequelize) => {
    // Remove the users we added in the up method
    return queryInterface.bulkDelete('users', {
      user_name: {
        [Sequelize.Op.in]: ['admin_user', 'regular_user', 'customer_user']
      }
    }, {});
  }
};
