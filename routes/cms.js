var express = require('express');
var router = express.Router();
var multer = require('multer');

var upload = multer({ dest: 'uploads/' })

var Blog = require('../model/blog')

/* GET searchpage. */


router.get('/', function(req, res, next) {
    Blog.find({}, (err, blogs) => {
        if (err) {
            res.locals.error = req.app.get('env') === 'development' ? err : {};
    
            res.render('error', { page: 'CMS' });
        }
        res.render('cms', { page: 'CMS', blogs})
    })
});

router.post('/create-posts', upload.single('poster'), function(req, res, next) {
    const { title, author, category, date, body} = req.body;

    console.log({ title, author, category, date, body});
    console.log(req.file);
    

    res.redirect('/cms')
    
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


router.post('/edit-post/:id', upload.single('avatar'), (req, res) => {
    const {id } = req.params;
    const body = res.body;

    Blog.updateOne({ _id: id}, { $set: { }}).exec((err, blog) => {
        if (err) {
            res.locals.error = req.app.get('env') === 'development' ? err : {};
    
            res.render('error', { page: 'Blog', message: err.message});
        }
        res.render('editblog', { page: 'Edit Post', blog})
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
