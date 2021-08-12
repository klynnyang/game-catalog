const User = require("../models/user");
const Game = require("../models/game");
const request = require("request");
const fs = require("fs");
const bcrypt = require("bcrypt")
const { body, validationResult } = require("express-validator");

function loginPage(req, res) {
    res.render("users/login", {
        title: "Login",
        user: req.user
    });
}

function newUser(req, res) {
    let errors = [];
    res.render("users/signup", {
        errors,
        title: "Sign Up",
        user: req.user
    });
}

function validationRules() {
    return [
    body("email", "Invalid email address").isEmail(),
    body("email").custom((value,{req}) => {
        if (value !== req.body.emailc) {
            throw new Error("Emails don't match");
        } else {
            return value;
        }
    }),
    body("password").custom((value,{req}) => {
        if (value !== req.body.passwordc) {
            throw new Error("Passwords don't match");
        } else {
            return value;
        }
    }),
    ]
}

async function validate(req, res, next) {
    errors = validationResult(req);
    let error = []
    const user = await User.findOne({username: req.body.username}).exec()
        if(user) {
            error.push({msg: "User already exists!"})
        }
    const email = await User.findOne({email: req.body.email}).exec()
        if(email) {
            error.push({msg:"Email already exists!"})
        }
    if(errors.isEmpty() && error.length === 0){
        return next()
    } 
    if(error.length > 0) {
        errors.errors.push(error[0])
    }
    let extractedErrors = errors.array().map(err => ({[err.param]: err.msg}))

    res.render("users/signup", {
        title:"Sign up",
        errors: extractedErrors,
        user: req.user
    })
}

async function hashPassword(password) {
    return await bcrypt.hash(password, 10)
}

async function create(req, res) {
    let {username, email, password, role} = req.body
    let hashedPassword = await hashPassword(req.body.password)
    let user = new User({username, email, password: hashedPassword, role:role ||"basic"});
    user.save(function(err){
        if(err) {
            res.render("users/signup", {
                user: req.user
            });return
        }
        res.redirect(`users/${user.id}`)
    }) 
}

async function show(req, res){
    const hour = new Date().getHours();
    let greeting = "Good " + (hour<12 && "Morning" || hour<18 && "Afternoon" || "Evening") + ",";
    let u = await User.findById(req.params.id).populate("watches", "name header_image developers");
    let gameWithReview = await Game.find({"reviews.userID" : req.params.id })
        res.render("users/show", {
            title: "User detail",
            u,
            greeting,
            user: req.user,
            gameWithReview
    });
};

function base64_encode(image) {
    var bitmap = fs.readFileSync(image);
    return bitmap.toString('base64');
}

function upload(req, res) {
    let image = base64_encode(req.files.image.file);

    const options = {
        method: 'POST',
        url: 'https://api.imgur.com/3/image',
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        },
        formData: {
          image: image,
          type: 'base64'
        },
      };
    request(options, function(err, response) {
        if (err) return console.log(err);
        let body = JSON.parse(response.body)
        User.findById(req.user._id, function(err, u){
            u.avatar = body.data.link
            u.save();
            res.redirect(`/users/${req.user._id}`)
        })
      })    
  }

  
module.exports = {
    loginPage,
    new: newUser,
    create,
    show,
    validationRules,
    validate,
    upload,
}
