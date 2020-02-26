const should = require("should");
const sinon = require("sinon");
const bookController = require("../controllers/booksController");

describe("Book Controller Tests", () => {
  describe("Testing the post method", () => {
    it("should not allow empty title field", () => {
      const Book = function(book) {
        this.save = () => {};
      };

      const req = {
        body: { author: "test" }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = bookController(Book);
      controller.post(req, res);
      res.status
        .calledWith(400)
        .should.equal(true, `Bad Status ${res.status.args[0][0]}`);
      res.send.calledWith("Title is required").should.equal(true);
    });
  });
});
