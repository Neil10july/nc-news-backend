process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiSorted = require("sams-chai-sorted");
chai.use(chaiSorted);
const { expect } = chai;
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

describe("/api", () => {
  beforeEach(() => knex.seed.run());

  describe("/topics", () => {
    describe("GET", () => {
      it("GET 200: responds with status 200 and an object containing topics data", () => {
        return request(app).get("/api/topics");
      });
    });
  });
});

after(() => {
  db.destroy();
});
