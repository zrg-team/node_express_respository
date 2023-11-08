'use strict';
const { v4: uuidv4 } = require('uuid');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('articles', [
      {
        id: uuidv4(),
        title: 'Introduction to Sequelize',
        description: 'A beginner\'s guide to using Sequelize with Node.js',
        user_id: 1, // Assuming user_id 1 exists in users table
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        title: 'Understanding MVC',
        description: 'How the MVC pattern structures a web application',
        user_id: 2, // Assuming user_id 2 exists in users table
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        title: 'Node.js Streams',
        description: 'Working with streams in Node.js for efficient data handling',
        user_id: 3, // Assuming user_id 3 exists in users table
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('articles', null, {});
  }
};
