const Pokemons = require("../models/pokemons");
const JSONStream = require("JSONStream");


const getPokemons = (req, res) => {
  try {
    Pokemons.find()
      .cursor()
      .pipe(JSONStream.stringify())
      .pipe(res.type("json"));
  } catch(err) {
    console.log(err);
    return res.status(err.code || 500).json(err.message);
  } 
};

const getPokemon = (req, res) => {
  try {
    let _id = req.params._id;

    if (!_id ) {
      throw {
        code: 400,
        message: "id is missing"
      }
    }

    if (isNaN(_id)) {
      throw {
        code: 400,
        message: "id is invalid"
      }
    }

    Pokemons.findOne({_id})
    .then((data) => {
      if (!data) {
        throw {code: 404, message: "no data is present"};
      }
      return res.status(200).json(data);
    })
    .catch((err)=> {
      return res.status(400).json(err.message);
    })
  } catch(err) {
    console.log(err);
    return res.status(err.code || 500).json(err.message);
  }
};

// const createPokemon = (req, res) => {

// };

module.exports = {
  getPokemons,
  getPokemon
}