var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

var Contact = require('../model/contact')
/* GET users listing. */
router.get('/', function(req, res, next) {
  
  res.render('contact', { page: 'Contact', msg: req.flash('msg'), errors: req.flash('errors')  })
});

router.post('/',[
  check('email').isEmail().withMessage('Email field is required!'), 
  check('message').notEmpty().withMessage('Message field is required'),
  check('name').notEmpty().withMessage('Name field is required'),
  check('subject').notEmpty().withMessage('Subject field is required')
], function(req, res) {
    const { message, name, email, subject } = req.body;
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('errors', errors.array() )

      return res.redirect(req.get('referer'))
    }

    let contact = new Contact()
    contact.message = message;
    contact.name = name;
    contact.email = email;
    contact.subject = subject;

    contact.save((err, msg) => {
      if (err) {
        res.locals.error = req.app.get('env') === 'development' ? err||errs : {};

        res.render('error', { page: 'Contact', message: err.message|| errs.message });
      } 
      console.log(msg);
      
      req.flash('msg', 'Thank you for contacting us. We will contact you soon.')
      res.redirect('/contact')
    })

     
})
module.exports = router;
