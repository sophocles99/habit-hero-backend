const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const endpointsFile = require("../endpoints.json");

afterAll(async () => await mongoose.connection.close());

describe("GET /", () => {
  test("404 - returns error for nonexistent page", () => {
    return request(app)
      .get("/notanendpoint")
      .expect(404)
      .then(({ body }) =>
        expect(body.error).toBe("Sorry, that page does not exist")
      );
  });
});

describe("GET /api", () => {
  test("200 - returns list of api endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => expect(body.endpoints).toMatchObject(endpointsFile));
  });
});
