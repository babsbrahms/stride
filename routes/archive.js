var express = require('express');
var router = express.Router();

var Blog = require('../model/blog')
var Category = require('../model/category');

/* GET users listing. */
router.get('/', function(req, res, next) {
  Blog.find({}, (err, blogs) => {
    Category.find({}, (errs, categories) => {
      if (err || errs) {
        res.locals.error = req.app.get('env') === 'development' ? err||errs : {};

        res.render('error', { page: 'Blog', message: err.message|| errs.message });
      }
      res.render('archive', { page: 'Archive', blogs, categories });
    })
  })
});

module.exports = router;
