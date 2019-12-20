const router = require("express").Router();
const Pokemons = require("../controllers/pokemons");
const PokemonsCategories = require("../controllers/pokemons-categories");

router.get("/categories", PokemonsCategories.getPokemonsCategories);

router.get("/categories/:categoryName", PokemonsCategories.getPokemonsCategory);

router.post("/categories", PokemonsCategories.createPokemonsCategory);

router.put("/categories/:categoryName", PokemonsCategories.updatePokemonsCategoryWithPokemonIds);

router.put("/categories/:categoryName/restore", PokemonsCategories.restorePokemonsCategory);

router.delete("/categories/:categoryName", PokemonsCategories.deletePokemonsCategory);

router.get("/", Pokemons.getPokemons);

router.get("/:_id", Pokemons.getPokemon);

// router.post("/");

// router.put('/:_id');

// router.delete("/:_id");


module.exports = router;