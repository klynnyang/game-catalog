const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    "userID" :{
      type: String
    },
    "username":{
      type: String,
    },
    "avatar": {
      type: String,
    },
    "review":{
      type: String
    },
    "rating":{
      type: Number,
      min: 1,
      max: 5,
      default: 5
    }
  },
  {
    timestamps: true,
  }
)

const gameSchema = new Schema({
  "steam_appid": {
    type: Number,
    required: true,
  },
  "name": {
    type: String,
    required: true,
  },
  "supported_languages": [String],
  "header_image": String,
  "developers": String,
  "publishers": String,
  "platforms": [String],
  "categories": [String],
  "genres": [String],
  "release_date": Date,
  "positive": Number,
  "negative": Number,
  "initial_price": Number,
  "discount%": Number,
  "final_price": Number,
  "total_review": Number,
  "rating": Number,
  "rating_star": Number,
  "website": String,
  "reviews": [reviewSchema]
},
{
  timestamps: true
})


module.exports = mongoose.model("Game", gameSchema);

