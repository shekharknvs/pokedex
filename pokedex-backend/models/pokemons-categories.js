const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema({
  name: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    default: 0,
    required: true
  },
  pokemonIds: {
    type: [Number]
  },
  is_deleted: {
    type: Boolean,
    default: false
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

Category.index({name: 1, version: -1}, {unique: true});

module.exports = mongoose.model("Category", Category);