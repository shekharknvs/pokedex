#!/bin/sh
docker-compose down
docker-compose up --build -d
sleep 5

docker exec mongo mongoimport -d pokemons-db -c pokemons --type json --file /docker-entrypoint-initdb.d/pokedex.json --jsonArray

cd ./pokedex-frontend
npm install
npm start