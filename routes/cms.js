var express = require('express');
var router = express.Router();
var multer = require('multer');
const { check, validationResult } = require('express-validator');

var upload = multer({ dest: './public/uploads/' })

var Blog = require('../model/blog')

/* GET searchpage. */


router.get('/', function(req, res, next) {
    Blog.find({}).sort({ createdAt: -1 }).exec(function (err, blogs) {
        if (err) {
            res.locals.error = req.app.get('env') === 'development' ? err : {};
    
            res.render('error', { page: 'CMS' });
        }
        res.render('cms', { page: 'CMS', blogs, msg: req.flash('msg'), errors: req.flash('errors') })
    })
});

router.post('/create-posts', upload.single('poster'), [
    check('title', 'Title field is required').notEmpty(),
    check('author', 'Author field is required').notEmpty(),
    check('category', 'Category field is required').notEmpty(),
    check('body', 'Body field is required').notEmpty()
], function(req, res, next) {
    const { title, author, category, body} = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('errors', errors.array() )

      return res.redirect('/cms')
    }
    
    Blog.create({
        title, author, category, body, poster: `/uploads/${req.file.filename}`
    }).then((doc) => {
        console.log(doc);
        req.flash('msg', 'Blog created')
        res.redirect(`/blog/${doc._id}`)
    })
    .catch((err) => {
        res.locals.error = req.app.get('env') === 'development' ? err : {};
    
        res.render('error', { page: 'CMS' });
    })
    
    
});


router.get('/edit-post/:id', (req, res) => {
    const {id } = req.params;

    Blog.findOne({ _id: id}, (err, blog) => {
        if (err) {
            res.locals.error = req.app.get('env') === 'development' ? err : {};
    
            res.render('error', { page: 'Blog', message: err.message});
        }
        res.render('editblog', { page: 'Edit Post', blog, msg: req.flash('msg'), errors: req.flash('errors') })
    })
})


router.post('/edit-post', upload.single('poster'), [
    check('title', 'Title field is required').notEmpty(),
    check('author', 'Author field is required').notEmpty(),
    check('category', 'Category field is required').notEmpty(),
    check('body', 'Body field is required').notEmpty(),
    check('id', 'Id field is required').notEmpty()
], function(req, res, next) {

    const { title, author, category, body, oldPoster, id} = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('errors', errors.array() )

      return res.redirect(`/edit-post/${id}`)
    }
    
    Blog.updateOne({ _id: id}, { $set: { 
        title, author, category, body, poster: (req.file && req.file.filename)? `/uploads/${req.file.filename}`: oldPoster
    }}).exec((err, blog) => {
        if (err) {
            res.locals.error = req.app.get('env') === 'development' ? err : {};
    
            res.render('error', { page: 'Blog', message: err.message});
        } else {
            req.flash('msg', 'Blog successfully edited')
            res.redirect(`/blog/${id}`)
        }
        
    })

});


router.delete('/delete-post/:id', (req, res) => {
    const {id} = req.params;
    console.log('delete id: ', id);
    
    Blog.deleteOne({ _id: id }).exec((err, done) => {
        if (err) {
            res.status(401).send(err.message)
        } else {
            res.send('Deleted')
        }
    })
})

module.exports = router;
