const knex = require("knex");

const knexfile = require("../knexfile.js");
const environment = knex(knexfile[process.env.DB_ENV || "development"]);

module.exports = environment;
