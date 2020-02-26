/* eslint-disable no-underscore-dangle */
const should = require("should");
const request = require("supertest");
const mongoose = require("mongoose");

process.env.NODE_ENV = "Test";
const app = require("../app");

const Book = mongoose.model("Book");
const agent = request.agent(app);

describe("Book CRUD Test", () => {
  let created = null;
  it("Should allow books to be created read and _id", done => {
    const book = { title: "Int Test", genre: "Fantasy", author: "bubka" };
    agent
      .post("/api/books")
      .send(book)
      .expect(200)
      .end((err, result) => {
        // console.log(result);
        created = result.body._id;
        result.body.read.should.equal(false);
        result.body.should.have.property("_id");
        done();
      });
  });

  afterEach(done => {
    Book.deleteOne({ _id: created }).exec();
    done();
  });

  after(done => {
    mongoose.connection.close();
    app.server.close(done());
  });
});
