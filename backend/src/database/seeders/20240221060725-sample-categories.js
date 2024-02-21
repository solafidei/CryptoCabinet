"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "AssetCategories",
      [
        {
          name: "Digital Art",
        },
        {
          name: "Collectibles",
        },
        {
          name: "Virtual Assets",
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("AssetCategories", null, {});
  },
};
