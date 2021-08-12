const Game = require("../models/game");
const User = require("../models/user");

async function newReview(req, res) {
    let user = await User.findById(req.user._id);
    let game = await Game.findById(req.params.id);
    let message = [];
        res.render("reviews/new", {
            u:user,
            g:game,
            title: "Add a review",
            user: req.user,
            message
        });
    };

async function createReview(req, res){
    let user = await User.findById(req.user._id);
    let game = await Game.findById(req.params.id);
    try{
        let sum = 0;
        let alreadyReviewed = game.reviews.some(r => r.userID == req.user._id)
        if(!alreadyReviewed) {
            game.reviews.push({"userID": user._id, "username": user.username, "avatar": user.avatar, "rating": req.body.rating, "review": req.body.review});
            game.reviews.forEach(function(r){
                sum += r.rating
            })
            game.rating_star = Math.round(sum / game.reviews.length * 100) / 100 
            game.save(function(err){
                if(err) console.log(err.message)
                res.redirect(`/games/${req.params.id}`)
            });
        } else {
            req.flash("msg", `${user.username} has already left a review for ${game.name}`)
            throw new Error(`${user.username} has already left a review for ${game.name}`)
        }
        }
    catch(err) {
        res.render("reviews/new", {
            u:user,
            g:game,
            title: "Add a review",
            user: req.user,
            message: req.flash("msg")
        });
    }
    }

async function deleteReview(req, res) {
    try{
        let game = await Game.findById(req.params.id);
        let idx = game.reviews.findIndex(r => r._id == req.params.rid);
        game.reviews.splice(idx, 1);
        game.save();
        res.redirect(`/games/${game._id}`)}
    catch {
        req.flash("message", err.message)
    }
}


module.exports = {
    new: newReview,
    create: createReview,
    delete: deleteReview
}