var express = require('express');
var router = express.Router();

var Blog = require('../model/blog')
var Category = require('../model/category');

/* GET users listing. */
router.get('/:name', function(req, res, next) {
  const {name} = req.params;

  Blog.find({ category: name }, (err, blogs) => {
    Category.find({}, (errs, categories) => {
      if (err || errs) {
        res.locals.error = req.app.get('env') === 'development' ? err||errs : {};

        res.render('error', { page: 'Blog', message: err.message|| errs.message });
      }
      res.render('category', { page: 'Category', blogs, categories });
    })
  })
});

module.exports = router;
