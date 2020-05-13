var express = require('express');
var router = express.Router();
var multer = require('multer');

var upload = multer({ dest: './public/uploads/' })

var Blog = require('../model/blog')

/* GET searchpage. */


router.get('/', function(req, res, next) {
    Blog.find({}).sort({ createdAt: -1 }).exec(function (err, blogs) {
        if (err) {
            res.locals.error = req.app.get('env') === 'development' ? err : {};
    
            res.render('error', { page: 'CMS' });
        }
        res.render('cms', { page: 'CMS', blogs})
    })
});

router.post('/create-posts', upload.single('poster'), function(req, res, next) {
    const { title, author, category, body} = req.body;


    console.log(req.file);
    
    Blog.create({
        title, author, category, body, poster: `/uploads/${req.file.filename}`
    }).then((doc) => {
        console.log(doc);
        res.redirect('/cms')
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
        res.render('editblog', { page: 'Edit Post', blog})
    })
})


router.post('/edit-post/:id', upload.single('poster'), (req, res) => {
    const {id } = req.params;
    const { title, author, category, body, oldPoster} = req.body;

    Blog.updateOne({ _id: id}, { $set: { 
        title, author, category, body, poster: (req.file && req.file.filename)? `/uploads/${req.file.filename}`: oldPoster
    }}).exec((err, blog) => {
        if (err) {
            res.locals.error = req.app.get('env') === 'development' ? err : {};
    
            res.render('error', { page: 'Blog', message: err.message});
        } else {
            res.redirect(`/blog/${id}`)
        }
        
    })
})


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
