var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

var Blog = require('../model/blog');
var Comment = require('../model/comment')


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
        } else {
          Comment.find({ blog: id }, (error, comments) => {
            if (error) {
              res.locals.error = req.app.get('env') === 'development' ? error : {};
    
              res.render('error', { page: 'Blog', message: error.message });
            } else {
              res.render('single-blog', { page: 'Blog', blog, categories, comments, msg: req.flash('msg'), errors: req.flash('errors')  });
            }
          })
        }
      })
    }

  })
});

router.post('/addcomment', [
  check('comment', 'Comment feild is required').notEmpty(),
  check('name field', 'Comment feild is required').notEmpty()
],(req, res) => {
  const { comment, blog, email, name, website } = req.body;
  console.log({ comment, blog, email, name, website });

  if (!errors.isEmpty()) {
    req.flash('errors', errors.array() )

    return res.redirect(`/blog/${blog}`)
  }

  Comment.create({
    comment,
    blog,
    email,
    name,
    website
  })
  .then(data => {
      res.json(data)
  })
  .catch(err => {
    res.send(err.message)
  })
  
})

/* GET searchpage. */


module.exports = router;
