'use strict';
const faker = require('faker');
module.exports = {
  up: (queryInterface, Sequelize) => {
    const productTypes = [];
    for (let i = 1; i <= 10; i++) {
      productTypes.push({
        code: faker.random.alphaNumeric(10),
        title: faker.commerce.productName(),
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    return queryInterface.bulkInsert('product_types', productTypes, {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('product_types', null, {});
  }
};
