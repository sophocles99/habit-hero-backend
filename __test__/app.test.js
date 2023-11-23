const mongoose = require("mongoose");
const request = require("supertest");
const seed = require("../db/seed");
const app = require("../app");

beforeEach(async () => await seed());

afterAll(async () => await mongoose.connection.close());

describe.only("General server tests", () => {
  test("404 - returns error for nonexistent page", () => {
    return request(app)
      .get("/notanendpoint")
      .expect(404)
      .then(({ body }) =>
        expect(body.error).toBe("Sorry, that page does not exist")
      );
  });
});
