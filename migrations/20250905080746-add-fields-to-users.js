'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Columns already exist in DB
    // This migration is a no-op
  },

  async down(queryInterface, Sequelize) {
    // Nothing to rollback since this was a no-op
  },
};
