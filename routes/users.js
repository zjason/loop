var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.user){
    res.render('users', {user_email: req.user.email});
  }else{
    res.redirect("/login");
  }
});

module.exports = router;
