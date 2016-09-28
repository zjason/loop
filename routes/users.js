var express = require('express');
var router = express.Router();

// image upload middleware
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
})

var upload = multer({ storage: storage }).array('userPhoto',2);

// db
var mongoose = require('mongoose');

var Bmarket = mongoose.model("Bmarket");

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.render('users', {user_email: "hello"});
  if (req.user){
    console.log(req.user.id);
    var userbucket;
    Bmarket.find({userid: req.user.id},function (err, items) {
      if (items.length){
        userbucket = items;
        console.log(items);
        res.render('users', {user_email: req.user.email, data: userbucket });
      }else{
        userbucket = [];
        res.render('users', {user_email: req.user.email, data: userbucket });
      }
    });
  }else{
    res.redirect("/login");
  }
});

/* POST item info */
router.post('/itempost', function (req, res, next) {
  upload(req,res,function(err) {
    //console.log(req.body);
    //console.log(req.files);
    if(err) {
      return res.end("Error uploading file.");
    }else{
      var newItem = new Bmarket(req.body);
      newItem.image_name = req.files[0].filename;
      newItem.userid = req.user.id;
      newItem.save();
      res.end("File is uploaded");
    }

  });
});

module.exports = router;
