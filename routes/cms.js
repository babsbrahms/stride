var express = require('express');
var router = express.Router();
var multer = require('multer');
var mongoose = require('mongoose');
var crypto = require('crypto');
var path = require('path');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');

const { check, validationResult } = require('express-validator');

var Blog = require('../model/blog')

// MONGODB URI
var mongoURI= "";
var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
    // dev mongo string
    mongoURI = process.env.DB_DEV;
} else {
    // production
    mongoURI = process.env.DB_PROD;
}
console.log("mongoURI: ", mongoURI);

// mongoose connection
const promise = mongoose.connect(mongoURI, { useNewUrlParser: true });

const conn = mongoose.connection;


// Init gfs 
let gfs;

conn.once('open',  ()=> {
  gfs = Grid(conn.db, mongoose.mongo);

  gfs.collection('uploads')
})



// create storaege engine (multer-gridfs-storage)
const storage = new GridFsStorage({
    //   url: mongoURI,
    db: promise,

  file: (req, file) => new Promise((resolve, reject) => {

            // bucketName === collectionName === 'uploades'
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                filename,
                bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
      
    })
  

});

var upload = multer({ storage })


router.get("/images/:filename", (req, res)=>{
    // gfs.files.find
    gfs.files.findOne({filename: req.params.filename}, (err, file)=>{
        if(err){
            res.status(404).json({err: 'Can\'t find your image'})
        }else if(!file){
            res.status(404).json({err: 'Can\'t find your image'})
        } else if(file){
            const fileStream = gfs.createReadStream(file)
            fileStream.pipe(res)
        }
    })
})


/* GET searchpage. */
router.use(loggedIn)

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

    console.log(req.file);
    
    
    Blog.create({
        title, author, category, body, poster: `/cms/images/${req.file.filename}`
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
        title, author, category, body, poster: (req.file && req.file.filename)? `/cms/images/${req.file.filename}` : oldPoster
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



function loggedIn (req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        next()

    } else {
        req.flash('errord', "Login is required")
        res.redirect('/login');
    }
}
module.exports = router;
