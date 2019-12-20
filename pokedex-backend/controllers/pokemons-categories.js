const PokemonsCategories = require("../models/pokemons-categories");
const Pokemons = require("../models/pokemons");
const JSONStream = require("JSONStream");


const getPokemonsCategories = (req, res) => {
  try {
    PokemonsCategories.find({is_deleted: false}, {name: 1, _id:0, version:1, pokemonIds: 1 })
    .cursor()
    .pipe(JSONStream.stringify())
    .pipe(res.type("json"));
  } catch(err) {
    console.log(err);
    return res.status(err.code || 500).json(err.message);
  }
}

const getPokemonsCategory = (req, res) => {
  try {
    let name = req.params.categoryName;

    if (!name ) {
      throw {
        code: 400,
        message: "id is missing"
      }
    }
    PokemonsCategories.findOne({name, is_deleted: false})
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
}

const createPokemonsCategory = (req, res) => {
  try {
    let body = req.body;

    if (!body ||!body.name) {
      throw {
        code: 400,
        message: "name is missing"
      };
    }
    if (!body.pokemonIds) {
      body.pokemonIds = [];
    }

    PokemonsCategories.findOne({name: body.name, is_deleted: false})
    .then(pokemonsCategory => {
      console.log(pokemonsCategory);
      if(pokemonsCategory) {
        throw {
          code: 400,
          message: `${body.name} category is already present`
        }
      }
      return true;
    })
    .then(()=>{
      if (body.pokemonIds && body.pokemonIds.length) {
        return Pokemons.find({_id: {$in: body.pokemonIds}})
        .count()
        .then(pokemonsCount => {
          if(pokemonsCount !== body.pokemonIds.length) {
            throw {
              code: 400,
              message: "pokemonIds is invalid"
            }
          }
          return pokemonsCount;
        })
      }
      return 1;
    })
    .then(() => {
      let pokemonsCategory = new PokemonsCategories({name: body.name, pokemonIds: body.pokemonIds});
      return pokemonsCategory.save()
    })
    .then((savedData) => {
      return res.status(201).json(savedData);
    })
    .catch((err) => {
      return res.status(401).json(err.message);
    });
  } catch(err) {
    console.log(err);
    return res.status(err.code || 500).json(err.message);
  }
};

const updatePokemonsCategoryWithPokemonIds = (req, res) => {
  try {
    let body = req.body;

    if (!body ||!body.name) {
      throw {
        code: 400,
        message: "name is missing"
      };
    }

    if (!body.pokemonIds || Array.isArray(!body.pokemonIds)) {
      throw {
        code: 400,
        message: "pokemonIds is missing"
      };
    }

    body.pokemonIds = [ ...new Set(body.pokemonIds) ];

    body.pokemonIds.forEach((pokemonIds) => {
      if (isNaN(pokemonIds)) {
        throw {
          code: 400,
          message: "pokemonIds is invalid"
        }
      }
    });

    Pokemons.find({_id: {$in: body.pokemonIds}})
    .count()
    .then(pokemonsCount => {
      if (pokemonsCount !== body.pokemonIds.length) {
        throw {
          code: 400,
          message: "pokemonIds in invalid"
        }
      }
      return PokemonsCategories.findOne({name: body.name, is_deleted: false});
    })
    .then((pokemonsCategory) => {
      if (!pokemonsCategory) {
        throw {code: 404, message: "no data is present"};
      }
      if (JSON.stringify(pokemonsCategory.pokemonIds) === JSON.stringify(body.pokemonIds)) {
        throw {
          code: 410,
          message: "no changes in pokemonIds"
        }
      }
      newPokemonsCategories = new PokemonsCategories({name: pokemonsCategory.name, version: pokemonsCategory.version + 1, pokemonIds: body.pokemonIds });

      return newPokemonsCategories.save()
      .then((savedData) => {
        pokemonsCategory.is_deleted = true;
        return pokemonsCategory.save()
        .then((savedData1) =>{
          return savedData;
        })
        .catch(err => {
          return newPokemonsCategories.remove()
          .then((removedData) => {
            throw {
              code: 400,
              message: "failed to updated"
            };
          })
        }); 
      })
    })
    .then((savedData) => {
      res.status(200).json(savedData);
    })
    .catch(err=> {
      return res.status(err.code || 400).json(err.message);
    })
  } catch(err) {
      res.status(err.code || 400).json(err.message);
  }
};

const deletePokemonsCategory = (req, res) => {
  try {

    let body = req.params;

    if (!body ||!body.categoryName) {
      throw {
        code: 400,
        message: "name is missing"
      };
    }

    PokemonsCategories.deleteMany({name: body.categoryName})
    .then((deletedDoc) => {
      if (!deletedDoc && !deletedDoc.length) {
        return res.status(404).json(`${name} category is not present`);
      }
      return res.status(204).json(body);
    })
    .catch(err=> {
      res.status(err.code || 400).json(err.message);
    }); 

  } catch(err) {
    res.status(err.code || 400).json(err.message);
  }
};

const restorePokemonsCategory = (req, res) => {
  try {
    let name = req.params.categoryName;
    console.log(name);
    if (!name) {
      throw {
        code: 400,
        message: "name is missing"
      };
    }

    PokemonsCategories.find({name: name})
    .then(categories => {
      if (!categories || categories.length < 2) {
        throw {
          message:"there is no data to restored",
          code: 400
        };
      }
      let last = categories.find(category=>!category.is_deleted);
      console.log(last);
      console.log(last.version - 1);
      console.log(categories);
      let restorableCategory = categories.find(category=> category.version === (last.version - 1));
      restorableCategory.is_deleted = false;
      restorableCategory.save()
      .then(restoredCategory => {
        return last.remove()
        .then(()=>{
          return restoredCategory;
        })
        .catch(err=> {
          restorableCategory.is_deleted = true;
          return restorableCategory.save()
          .then(()=>{
            throw {
              error: 400,
              message: "failed to restored"
            };
          })
        });
      })
      .then((savedData) => {
        return res.status(200).json(savedData);
      })
      .catch(err=> {
        res.status(err.code || 400).json(err.message);
      });
    })
    .catch(err=> {
      res.status(err.code || 400).json(err.message);
    });

  } catch(err) {
    res.status(err.code || 400).json(err.message);
  }
}

module.exports = {
  getPokemonsCategories,
  getPokemonsCategory,
  createPokemonsCategory,
  updatePokemonsCategoryWithPokemonIds,
  deletePokemonsCategory,
  restorePokemonsCategory
}