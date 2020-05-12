var express = require('express');
var router = express.Router();

var Blog = require('../model/blog')

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  const { id } = req.params;
  Blog.findOne({ _id: id }, (err, blog) => {
    if (err) {
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      res.render('error', { page: 'Blog', message: err.message });
    } else {
      Blog.distinct('category').exec((errs, categories) => {
        if (errs) {
          res.locals.error = req.app.get('env') === 'development' ? errs : {};

          res.render('error', { page: 'Blog', message: errs.message });
        }
        
        res.render('single-blog', { page: 'Blog', blog, categories });
      })
    }

  })
});

module.exports = router;
