/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

const express = require("express");
const booksController = require("../controllers/booksController");

function routes(Book) {
  const bookRouter = express.Router();
  const controller = booksController(Book);

  // Get All books
  bookRouter
    .route("/books")
    .post(controller.post)
    .get(controller.get);

  // Using middleware for intercepting request
  bookRouter.use("/books/:id", (req, res, next) => {
    Book.findById(req.params.id, (err, book) => {
      if (err) {
        return res.json(err);
      }
      if (book) {
        req.book = book;
        return next();
      }
      return res.sendStatus(404);
    });
  });

  // Get A single book
  bookRouter
    .route("/books/:id")
    .get((req, res) => {
      const returnBook = req.book.toJSON();
      returnBook.links = {
        FilterByThisGenre: encodeURI(
          `http://${req.headers.host}/api/books?genre=${req.book.genre}`
        )
      };
      return res.json(returnBook);
    })
    .put((req, res) => {
      const { book } = req;
      Object.entries(req.body).forEach(item => {
        book[item[0]] = item[1];
      });
      req.book.save(err => {
        if (err) {
          return res.json(err);
        }
        return res.json(book);
      });
    })
    .patch((req, res) => {
      const { book } = req;
      if (req.body._id) {
        delete req.body._id;
      }
      Object.entries(req.body).forEach(item => {
        book[item[0]] = item[1];
      });
      req.book.save(err => {
        if (err) {
          return res.json(err);
        }
        return res.json(book);
      });
    })
    .delete((req, res) => {
      req.book.remove(err => {
        if (err) {
          return res.json(err);
        }
        return res.sendStatus(204);
      });
    });

  return bookRouter;
}

module.exports = routes;
