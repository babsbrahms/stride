var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

var Contact = require('../model/contact')
/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('FLASH:', req.flash('errors'));
  
  res.render('contact', { page: 'Contact', message: req.flash('message'), errors: req.flash('errors') })
});

router.post('/',[
  check('message').isEmpty().withMessage('Message feild cannot be empty'), 
  check('email').isEmail().withMessage('Enter a valid email'), 
  check('subject').isEmpty().withMessage('Subject feild cannot be empty'), 
  check('name').isEmpty().withMessage('Name feild cannot be empty')], function(req, res) {
    const { message, name, email, subject } = req.body;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(422).json({ errors: errors.array() });
      console.log('error: ', errors);
      
      req.flash('errors', errors)
      res.redirect('/contact')
    } else {
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
        
        req.flash('message', 'Thank you for contacting us. We will contact you soon.')
        res.redirect('/contact')
      })
    }
    

    
})
module.exports = router;
