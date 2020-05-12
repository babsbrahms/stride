var express = require('express');
var router = express.Router();
var Blog = require('../model/blog')

/* GET searchpage. */


router.get('/', function(req, res, next) {
    Blog.find({}, (err, blogs) => {
        if (err) {
            res.locals.error = req.app.get('env') === 'development' ? err : {};
    
            res.render('error', { page: 'Blog', message: err.message});
        }
        res.render('cms/posts', { msg: '', posted: '', blogs})
    })
});

router.get('/edit-posts/:id', (req, res) => {
    const {id } = req.params;

    Blog.findOne({ _id: id}, (err, blog) => {
        if (err) {
            res.locals.error = req.app.get('env') === 'development' ? err : {};
    
            res.render('error', { page: 'Blog', message: err.message});
        }
        res.render('cms/edit-posts', { msg: '', posted: '', blog})
    })
})

router.get('/users', function(req, res, next) {
    res.render('cms/users')
});

module.exports = router;