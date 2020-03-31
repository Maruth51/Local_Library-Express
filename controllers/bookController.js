var Book = require("../models/book");
var Author = require("../models/author");
var Genre = require("../models/genre");
var BookInstance = require("../models/bookinstance");
const validator = require("express-validator")
const {body,validationResult}= require("express-validator/check")
const {sanitizeBody}= require("express-validator/filter")
const async = require("async");

exports.index = function(req, res) {
  async.parallel(
    {
      book_count: callback => {
        Book.countDocuments({}, callback);
      },
      book_instance_count: function(callback) {
        BookInstance.countDocuments({}, callback);
      },
      book_instance_available_count: function(callback) {
        BookInstance.countDocuments({ status: "Available" }, callback);
      },
      author_count: function(callback) {
        Author.countDocuments({}, callback);
      },
      genre_count: function(callback) {
        Genre.countDocuments({}, callback);
      }
    },
    function(err, results) {
      res.render("index", {
        title: "Local Library Home",
        error: err,
        data: results
      });
    }
  );
};

// Display list of all books.
exports.book_list = function(req, res) {
  Book.find({}, "title author")
    .populate("author")
    .exec(function(err, list_books) {
      if (!err) {
        res.render("book_list", { title: "Book List", book_list: list_books });
      } else res.status(404);
    });
};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next) {
  async.parallel({
    book: function(callback) {
      Book.findById(req.params.id)
        .populate('genre')
        .populate('author')
        .exec(callback);
    },
    book_instance: function(callback) {
      BookInstance.find({ book: req.params.id }).exec(callback);
    }},
    function(err, results) {
  
      if (err) { return next(err); }
      if (results.book==null) { // No results.
          var err = new Error('Book not found');
          err.status = 404;
          return next(err);
      }
      // Successful, so render.
      res.render('book_detail', { title: results.book.title, book: results.book, book_instances: results.book_instance } );
  }
  );
};

// Display book create form on GET.
exports.book_create_get = function(req, res,next) {
  async.parallel({
    authors: function(callback) {
        Author.find(callback);
    },
    genres: function(callback) {
        Genre.find(callback);
    },
}, function(err, results) {
    if (err) { return next(err); }
    res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
});
};

// Handle book create on POST.
exports.book_create_post = [
  body("title","Title cannot be empty").trim().isLength({min:1}),
  body("author","autor cannot be empty").trim().isLength({min:1}),
  body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }),
  body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }),

  sanitizeBody('*').escape(),

  function(req, res,next) {
    const error = validationResult(req)
    if(error.isEmpty()){
      const book = new Book({
        title : req.body.title,
        author: req.body.author,
        summary:req.body.summary,
        isbn : req.body.isbn,
        genre:req.body.genre

      })
      book.save().then((result)=>{
        res.render(book.url)
      })
    }else{

      async.parallel({
        authors: function(callback) {
            Author.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
    });

    }
  
}]

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
  res.send("NOT IMPLEMENTED: Book delete GET");
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
  res.send("NOT IMPLEMENTED: Book delete POST");
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
  res.send("NOT IMPLEMENTED: Book update GET");
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
  res.send("NOT IMPLEMENTED: Book update POST");
};
