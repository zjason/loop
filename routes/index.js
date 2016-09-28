var express = require('express');
var router = express.Router();

// db
var mongoose = require('mongoose');
// create schema
var marketSchema = new mongoose.Schema({
    userid: String,
    item: String,
    description: String,
    price: Number,
    contract_info: String,
    type: String,
    image_name: String
});
var Bmarket = mongoose.model("Bmarket", marketSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
    var itembucket;
    var usertab = '';
    if (!req.user){
        usertab = "<li><a href='login'>Login/Register</a></li>";
    }else{
        usertab = "<li><a href='users'>"+ req.user.username+"</a></li>"+"<li><a href='logout'>Logout</a></li>";
    }
    Bmarket.find({}, function (err, items) {
        if (items.length){
            itembucket = items;
            console.log(itembucket);
            res.render('index', { title: 'Bburg Market', usertab: usertab, data: itembucket, message: "" });
        }else{
            console.log("no item in database");
            itembucket = [];
            res.render('index', { title: 'Bburg Market', usertab: usertab, data: itembucket, message: "No item in database!" });
        }

    });

});

/* GET logout page */
// This function will destroy session to logout user
router.get('/logout', function (req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

/* POST query item */
router.post('/query', function (req, res, next) {
    var queryResult;
    if (req.body.type == "All"){
        Bmarket.find({}, function (err, items) {
            if (items.length){
                queryResult = items;
                res.render('index',{ title: 'Bburg Market', data: queryResult, message: "" });
            }
        });
    }else {
        Bmarket.find({type: req.body.type}, function (err, items) {
            if (items.length) {
                queryResult = items;
                console.log(items);
                res.render('index', {title: 'Bburg Market', data: queryResult, message: ""});
            } else {
                console.log('No matching result!');
                queryResult = [];
                res.render('index', {title: 'Bburg Market', data: queryResult, message: "No matching result!"});
            }
        });
    }
});

// router.post('/api/photo',function(req,res){
//     upload(req,res,function(err) {
//         //console.log(req.body);
//         //console.log(req.files);
//         if(err) {
//             return res.end("Error uploading file.");
//         }
//         console.log(req.files.fieldname);
//         res.end("File is uploaded");
//     });
// });

module.exports = router;
