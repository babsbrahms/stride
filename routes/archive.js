var express = require('express');
var router = express.Router();

var Blog = require('../model/blog')

/* GET users listing. */
router.get('/', function(req, res, next) {
  Blog.find({}).sort({ createdAt: -1 }).exec(function(err, blogs) {
    Blog.distinct('category').exec((errs, categories) => {
      if (err || errs) {
        res.locals.error = req.app.get('env') === 'development' ? err||errs : {};

        res.render('error', { page: 'Blog', message: err.message|| errs.message });
      }
      res.render('archive', { page: 'Archive', blogs, categories, msg: req.flash('msg'), errors: req.flash('errors')  });
    })
  })
});

module.exports = router;
