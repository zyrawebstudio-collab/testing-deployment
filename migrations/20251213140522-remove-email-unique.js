"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("contacts", "email", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("contacts", "email", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },
};
