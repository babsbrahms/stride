var express = require('express');
var router = express.Router();

var Blog = require('../model/blog');
var Newsletter = require('../model/newletter')

/* GET home page. */
router.get('/', function(req, res, next) {
  Blog.find({}).sort({ date: -1 }).exec(function (err, blogs) {
    Blog.distinct('category').exec((errs, categories) => {
      if (err || errs) {
        res.locals.error = req.app.get('env') === 'development' ? err||errs : {};

        res.render('error', { page: 'Blog', message: err.message|| errs.message });
      }
      res.render('index', { page: 'Home', blogs, categories });
    })
  })

});


router.post('/newsletter' , (req, res) => {
  const { email, name } = req.body;
  
  Newsletter.create({
    email,
    name
  })
  .then(news => {
    res.redirect(req.get('referer'));
  })
  .catch((err) => {
    res.send(err)
  })
})

module.exports = router;
