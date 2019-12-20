const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Pokemon = new Schema({
  _id: {
    type: Number
  },
  name:{
    type: String,
    default: "",
    required: true
  },
  weight: {
    type: Number,
    default: 0.0
  },
  thumbnailImage: {
    type: String,
    default: "",
  },
  thumbnailAltText: {
    type: String,
    default: ""
  },
  number: {
    type: String,
    default: "000"
  },
  height: {
    type: Number,
    default: 0
  },
  collectibles_slug: {
    type: String,
    default: ""
  },
  featured: {
    type: Boolean,
    default: false
  },
  type: {
    type: [String],
    default: []
  },
  slug: {
    type: String,
    default: ''
  },
  abilities: {
    type:[String],
    default: []
  },
  created_timestamp: {
    type: Date,
    default: Date.now
  },
  modified_timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Pokemon", Pokemon);