
const router = (app )=> {

  // pokemons

  app.use("/pokemons", require("./pokemons"));

  // default case
  app.all("*", function(req, res) {
    res.status(404).send("NOT FOUND 404  !!!");
  })
};

module.exports = router;