var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

var Blog = require('../model/blog');
var Newsletter = require('../model/newletter')

/* GET home page. */
router.get('/', function(req, res, next) {
  Blog.find({}).sort({ createdAt: -1 }).exec(function (err, blogs) {
    Blog.distinct('category').exec((errs, categories) => {
      if (err || errs) {
        res.locals.error = req.app.get('env') === 'development' ? err||errs : {};

        res.render('error', { page: 'Blog', message: err.message|| errs.message });
      }
      res.render('index', { page: 'Home', blogs, categories, msg: req.flash('msg'), errors: req.flash('errors') });
    })
  })

});


router.post('/newsletter' , [ check('email').isEmail().withMessage('Email is required')], (req, res) => {
  const { email, name } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash('errors', errors.array() )
    
    return res.redirect(req.get('referer'))
  }

  Newsletter.create({
    email,
    name
  })
  .then(news => {
    req.flash('msg', 'You have sucessfully subscribe for our newsletter')
    res.redirect(req.get('referer'));
  })
  .catch((err) => {
    res.send(err)
  })
})


router.get('/search', function(req, res, next) {
  let { search } = req.query;
  console.log(search);
  Blog.find({ $text: {$search : search }}, (err, result) => {
    if (err) {
      res.status(400).send({ msg: err.message })
    }
    console.log(result);
    
    res.send({ result })
  })
});

module.exports = router;
