const Author = require("../models/author");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");
const async = require("async");
exports.author_list = (req, res, next) => {
  Author.find({})
    .populate("author")
    .sort([["first_name", "ascending"]])
    .exec((err, author_list) => {
      if (!err) {
        res.render("author_list", {
          title: "Author List",
          author_list
        });
      } else return next(err);
    });
};

exports.author_detail = function(req, res) {
  async.parallel(
    {
      author: function(callback) {
        Author.findById(req.params.id).exec(callback);
      },
      authors_books: function(callback) {
        Book.find({ 'author': req.params.id }, "title summary").exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.author == null) {
        var err = new Error("Author not found");
        err.status = 404;
        return next(err);
      }
      res.render("author_detail", {
        title: "Author Detail",
        author: results.author,
        author_books: results.authors_books
      });
    }
  );
};

// Display Author create form on GET.
exports.author_create_get = function(req, res) {
  res.render("author_form", { title: "Create Author" });
};

// Handle Author create on POST.
exports.author_create_post = [
  body("first_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("First name is required")
    .isAlphanumeric()
    .withMessage("first name should be alphabhet"),
  body("family_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("family name is required")
    .isAlphanumeric()
    .withMessage("Last name should be alphabhet"),
  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601(),
  body("date_of_death", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601(),
  sanitizeBody("first_name").escape(),
  sanitizeBody("family_name").escape(),
  sanitizeBody("data_of_birth").toDate(),
  sanitizeBody("data_of_death").toDate(),
  function(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death
      });
      author.save((err, author) => {
        if (err) {
          return next(err);
        } else res.redirect(author.url);
      });
    } else {
      res.render("author_form", {
        title: "create author",
        errors,
        author: req.body
      });
    }
  }
];

// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
  res.send("NOT IMPLEMENTED: Author delete GET");
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
  res.send("NOT IMPLEMENTED: Author delete POST");
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
  res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
  res.send("NOT IMPLEMENTED: Author update POST");
};
