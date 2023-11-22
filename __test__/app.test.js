const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

afterAll((done) => {
  mongoose.connection.close();
  done();
});

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
