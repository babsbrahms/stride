var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

var Blog = require('../model/blog');
var Comment = require('../model/comment')


router.get('/', function(req, res, next) {
  const {nav} = req.query;
  let current = req.session.blog_number || 0;
  if (nav === 'previous' && (current !== 0) ) {
    current = current - 1;
  } else if (nav === 'next') {
    current = current + 1;
  } 

  req.session.blog_number = current;
  let limit = 10;
  let skip = limit*current;
  Blog.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(function (err, blogs) {
    Blog.distinct('category').exec((errs, categories) => {
      if (err || errs) {
        res.locals.error = req.app.get('env') === 'development' ? err||errs : {};

        res.render('error', { page: 'Blog', message: err.message|| errs.message });
      } else if ((blogs.length === 0) && (current !== 0)) {
        let count = (current > 0)? current - 1 : 0
        req.session.blog_number = count;
        res.redirect('/blog')
      } else {
        res.render('blog', { page: 'Blog', blogs, categories, msg: req.flash('msg'), errors: req.flash('errors'), current_number: current, limit });
      }
    })
  })
});

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
  check('name', 'Name feild is required').notEmpty()
],(req, res) => {
  const { comment, blog, email, name, website } = req.body;
  console.log({ comment, blog, email, name, website });

  const errors = validationResult(req);

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

    res.redirect(req.get('referer'))
  })
  .catch(err => {
    res.send(err.message)
  })
  
})

/* GET searchpage. */


module.exports = router;
