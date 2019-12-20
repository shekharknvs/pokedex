const config = {
  db: {
    host: process.env.MONGODB_HOST,
    port: process.env.MONGODB_PORT,
    dbname: process.env.MONGODB_POKEMON
  }
}


// const config = {
//   db: {
//     host: "127.0.0.1",
//     port: 27017,
//     dbname: "pokemons-db"
//   }
// }

module.exports = config;