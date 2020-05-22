const supertest = require("supertest")
const server = require('../api/server');
const db = require('../database/dbConfig');

beforeEach(() =>{
    return db.migrate
    .rollback()
    .then(() => db.migrate.latest());
});

describe('')