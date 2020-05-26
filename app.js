var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');
require('dotenv').config()

var indexRouter = require('./routes/index');
var contactRouter = require('./routes/contact');
var aboutRouter = require('./routes/about');
var blogRouter = require('./routes/blog');
var categoryRouter = require('./routes/category');
var csmRouter = require('./routes/cms')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// mongodb
// mongoose
var mongoURI= "";
var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
  // dev mongo string
  mongoURI = process.env.DB_DEV;
} else {
  // production
  mongoURI = process.env.DB_PROD;
}
mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
let mdb = mongoose.connection;

mdb.once('open', () => {
    console.log('mongo connected');  
})

mdb.on('error', (err) => {
    console.log(err);  
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




  // app.use(express.cookieParser('keyboard cat'));
  app.use(session({   
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
  }));

  app.use(flash());

  // This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
  // This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
  app.use((req, res, next) => {
      if (req.cookies.user_sid && !req.session.user) {
          res.clearCookie('user_sid');        
      }
      next();
  });


app.use('/', indexRouter);
app.use('/contact', contactRouter);
app.use('/about', aboutRouter);
app.use('/blog', blogRouter);
app.use('/category', categoryRouter);
app.use('/cms', csmRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { page: 'Error', msg: req.flash('msg'), errors: req.flash('errors') });
});

let port = 5000;
app.listen(port, () => {
  console.log('live on port: ', port);
  
})
// module.exports = app;
