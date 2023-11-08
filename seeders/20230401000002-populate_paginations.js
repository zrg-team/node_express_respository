'use strict';
const { v4: uuidv4 } = require('uuid');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('paginations', [
      {
        id: uuidv4(),
        current_page: 1,
        per_page: 10,
        total_pages: 5,
        has_pagination: true,
        articles_per_page: 10,
        is_visible: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        current_page: 2,
        per_page: 10,
        total_pages: 3,
        has_pagination: true,
        articles_per_page: 10,
        is_visible: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        current_page: 3,
        per_page: 5,
        total_pages: 10,
        has_pagination: true,
        articles_per_page: 5,
        is_visible: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('paginations', null, {});
  }
};
