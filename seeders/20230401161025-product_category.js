'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    // Note: Here we are assuming that the 'product_categories' table has columns 'id', 'name', 'description', 'created_at', and 'updated_at'.
    // The 'created_at' and 'updated_at' columns will be filled with the current date and time by Sequelize.
    return queryInterface.bulkInsert('product_categories', [{
      name: 'Electronics',
      description: 'Gadgets and electronic devices'
    }, {
      name: 'Books',
      description: 'All kinds of books and literature'
    }, {
      name: 'Clothing',
      description: 'Apparel and accessories for all'
    }], {});
  },
  down: (queryInterface, Sequelize) => {
    // Here we are assuming that the 'product_categories' table uses a sequential integer ID starting at 1.
    // Adjust the array of IDs to match the IDs of the rows inserted above.
    return queryInterface.bulkDelete('product_categories', {
      id: {
        [Sequelize.Op.in]: [1, 2, 3]
      }
    }, {});
  }
}
