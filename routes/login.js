var express = require('express');
var router = express.Router();

// hash User's password
var bcrypt = require('bcrypt');
const saltRounds = 10;

// connect to mongoDB
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// create schema
var UserSchema = new mongoose.Schema({
    email: {type: String, index: true, unique: true, required: true},
    username: {type: String,  required: true},
    password: {type: String, required: true}
});
UserSchema.plugin(uniqueValidator);
var User = mongoose.model("User", UserSchema);

// passport setup
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

// passport configuration
passport.use(new Strategy(
    function(email, password, cb) {
        User.findOne({email: email}, function(err, user) {
            if (err) {
                return cb(err);
            }
            if (!user) {
                return cb(null, false);
            }
            // bcypt.compare() is a Async function
            bcrypt.compare(password, user.password, function(err, res) {
                if (!res) {
                    return cb(null, false, {error_handler: "password or email is wrong!"});
                }else{
                    return cb(null, user);
                }
            });
        });
    }));

passport.serializeUser(function(user, cb) {
    cb(null, user.email);
});

passport.deserializeUser(function(email, cb) {
    User.findOne({email: email}, function (err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});

/* GET Login page. */
router.get('/', function(req, res, next) {
    res.render('login', {error_handler: ""});
});

/* POST to signup form */
router.post('/signup', function(req, res, next){
    User.findOne({email: req.body.email}, function (err, target) {
            if (target){
                res.render('login', {error_handler: "Email already exist!"});
            }else{
                var newUser = new User(req.body);
                // bcypt.hash() is a Async function
                bcrypt.hash(req.body.password, saltRounds, function(err, hash){
                    newUser.password = hash;
                    newUser.save();
                });
                res.redirect('/login');
            }
        });
});

/* POST to login form */
router.post('/', passport.authenticate('local', { successRedirect: '/',
    failureRedirect: '/login'}));


module.exports = router;