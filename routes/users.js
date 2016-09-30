var express = require('express');
var router = express.Router();

// image upload middleware
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg');
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
    var userbucket;
    Bmarket.find({userid: req.user.id},function (err, items) {
      if (items.length){
        userbucket = items;
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
    if(err) {
      return res.end("Error uploading file.");
    }else{
      var newItem = new Bmarket(req.body);
      req.files.forEach(function (img) {
        var imagename = {image_name: img.filename};;
        newItem.images.push(imagename);
      });
      newItem.userid = req.user.id;
      console.log(newItem);
      newItem.save(function (err) {
        if (err){
          console.log(err);
          handlerError(res, err);
        }else{
          res.redirect("/users");
        }
      });

    }

  });
});

/* POST remove item  */
router.post('/itemsold', function (req, res, next) {
  if (req.user){
    Bmarket.remove({_id: req.body.soldbutton}, function (err) {
      if (err){
        return handleError(err);
      }else{
        res.redirect('/users');
      }
    });
  }
});

module.exports = router;
