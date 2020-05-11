var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var contactRouter = require('./routes/contact');
var archiveRouter = require('./routes/archive');
var blogRouter = require('./routes/blog');
var categoryRouter = require('./routes/category');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// mongodb
// mongoose
mongoose.connect('mongodb://localhost:27017/prepventblog', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
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

app.use('/', indexRouter);
app.use('/contact', contactRouter);
app.use('/archive', archiveRouter);
app.use('/blog', blogRouter);
app.use('/category', categoryRouter);


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
  res.render('error', { page: 'Error'});
});

let port = 5000;
app.listen(port, () => {
  console.log('live on port: ', port);
  
})
// module.exports = app;
