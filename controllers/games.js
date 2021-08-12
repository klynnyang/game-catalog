const Game = require("../models/game");
const User = require("../models/user");
const request = require("request");
const fs = require("fs");

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

async function index(req, res) {
    const {page = 1, limit = 10} = req.query; 
    let count, regex;
    if(req.query.search){
        regex = new RegExp(escapeRegex(req.query.search), "gi");    
        count = await Game.find({name: regex}).countDocuments().exec();   
    } else {
        count = await Game.countDocuments().exec();
    }
    let totalPage = Math.ceil(count/limit)
    let pageArray = [...Array(totalPage + 1).keys()]
    pageArray.shift();
    let pageNum = pageArray.indexOf(parseInt(page)) + 1;
    let pageLowerLimit = pageNum - 4;
    let pageHigherLimit = pageNum + 4;
    let pageFooter = []
    if (pageArray.length < 10) {
        pageFooter = pageArray;
    } else {
        if (pageNum > 5 && pageNum < totalPage - 5){
            for(let i = pageLowerLimit; i <= pageHigherLimit; i++){
                pageFooter.push(i)
            }
        } else if (pageNum <= 5) {
            pageFooter = [...Array(10).keys()];
            pageFooter.shift();
        } else if (pageNum >= totalPage - 5){
            for(let i = totalPage - 9; i <= totalPage; i++){
                pageFooter.push(i)
            }
        } 
    }
    if(req.query.search){   
        regex = new RegExp(escapeRegex(req.query.search), "gi"); 
        let games = await Game.find({name: regex}, function(err, allGames){
            res.render("games/index", {
                title: "Search results",
                game: allGames,
                totalPage: totalPage,
                page: page,
                pageFooter: pageFooter,
                query: req.query.search,
                user: req.user
            });
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort("steam_appid")
        .exec();
    } else{
        let games = await Game.find({}, function(err, allGames){
            res.render("games/index", {
                title: "All games",
                game: allGames,
                totalPage: totalPage,
                page: page,
                pageFooter: pageFooter,
                query:"",
                user: req.user
            });
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort("steam_appid")
        .exec();
    }
}


function show(req, res){
    Game.findById(req.params.id, function(err, game){
        res.render("games/show", {
            g:game,
            title: "Game detail",
            user: req.user
        });
    });
};

async function update(req, res) {
    const game = await Game.findById(req.params.id).exec()
    let message = []
    res.render("games/update", {
        title: "Update Information",
        user: req.user,
        game,
        message
    })
}

async function put(req, res) {
    try{
        if(!req.user){
            req.flash("msg", "not logged in")
            throw new Error("User not logged in")
        } else if (req.user.role !== "admin"){
            req.flash("msg", "not an admin")
            throw new Error("User account not an admin role")
        } else {
        let query = {"_id": req.params.id};

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
            let body = JSON.parse(response.body)
            req.body.header_image = body.data.link 
            req.body.platforms = req.body.platforms.split(",")
            req.body.categories = req.body.categories.split(",")
            req.body.supported_languages = req.body.supported_languages.split(",")
            req.body.genres = req.body.genres.split(",")
            Game.findOneAndUpdate(query, req.body, {upsert: true}, function(err, game){
                res.redirect(`/games/${req.params.id}`)
            })
        })
        }
    }
    catch(err){
        let game = await Game.findById(req.params.id).exec();
        res.render("games/update", {
            title: "Update Information",
            user: req.user,
            game,
            message: req.flash("msg")
        })
    }
}


function newGame(req, res){
    res.render("games/new", {
        title: "Add a game",
        user: req.user
    })
}

function deleteGame(req, res) {
    if(req.user.role === "admin") {
        Game.findByIdAndDelete(req.params.id, function(){
            res.redirect("/games")
        })
    } else {
        res.redirect(`/games/${req.params.id}`)
    }
}

function base64_encode(image) {
    var bitmap = fs.readFileSync(image);
    return bitmap.toString('base64');
}

function create(req, res){
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
        const game = new Game (
            {
                "steam_appid": req.body.steam_appid,
                "header_image": body.data.link,
                "name":  req.body.name,
                "developers": req.body.developers,
                "publishers": req.body.publishers,
                "platforms": req.body.platforms,
                "categories": req.body.categories,
                "supported_languages": req.body.supported_languages,
                "genres": req.body.genres,
                "release_date": req.body.release_date
            }
        )
        game.save(function(err){
            if(err) return res.render("games/new")
        })
        res.redirect(`/games/${game.id}`)
    })
}

function addGame(req, res){
    let backURL = req.header("Referer") || "/";
    User.findById(req.user._id, function(err, user) {
        user.watches.push(req.params.id);
        user.save(function(err){
            res.redirect(backURL)
        })
    })
}

async function deleteFromWatchlist(req, res){
    user = await User.findById(req.user._id);
    let idx = user.watches.findIndex(w => w == req.params.id);
    user.watches.splice(idx, 1);
    user.save();
    res.redirect(`/users/${req.user._id}`)
}


module.exports = {
    index,
    show,
    delete: deleteGame,
    new: newGame,
    create,
    addGame,
    deleteGame: deleteFromWatchlist,
    update,
    put
}