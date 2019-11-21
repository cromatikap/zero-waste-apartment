const express = require('express');
const app = express();
const path = require('path');
const { check, validationResult, sanitizeBody } = require('express-validator');

app.use(express.static('www/public'));
app.use(express.urlencoded({extended: true}));
app.engine('html', require('ejs').renderFile);

function ContactForm() {
  this.email = {
    value: null,
    error: null
  }
  this.message = {
    value: null,
    error: null
  }
}

app.get('/', function (req, res) {
  res.render(path.join(__dirname + '/www/index.html'), new ContactForm());
});

app.post('/', [
  check('email', 'Please fill a valid email address.').isEmail(),
  check('message', 'Your message content should be between 5 and 512 characters').isLength({min: 5, max: 512})
], function (req, res) {
  let form = new ContactForm();
  const errors = validationResult(req).errors;
  console.log(errors);
  errors.map((err) => {
    form[err.param].error = err.msg;
  });
  // if(!errors.isEmpty()){
  //   form.email.error
  // }

  /*
    NOTE TO MYSELF
    --------------
    Interesting to manipulate objects like this, but after further thinking,
    it's better to keep the original errors handling from validationResult(req).errors
    and just loop on the errors to display it on the view (and sanitize + valide when
    the errors array is empty)

    I take a break, commit and push to github ;)
  */

  form.email.value = req.body.email;
  form.message.value = req.body.message;
  console.log(form);
  res.render(path.join(__dirname + '/www/index.html'), form);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
