const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    "username": {
        type: String,
        unique: true,
    },
    "email":{
        type: String,
        unique: true,
    },
    "password":{
        type: String,
    },
    "avatar":{
        type: String,
        default: "https://i.imgur.com/FXrFVi8.png"
    },
    "googleId": {
        type: String
    },
    "role":{
        type: String,
        default:"basic",
        enum: ["basic", "admin"]
    },
    "watches": [{type: Schema.Types.ObjectId, ref: 'Game'}],
},
{
    timestamps: true
});


module.exports = mongoose.model("user", userSchema);