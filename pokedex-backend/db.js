const mongoose = require("mongoose");

const connectDB = (host,port, dbname, options={}) => {
  console.log(dbname);
  if (!host || !dbname) {
    console.log(host ? "dbname is missing": "dbhost is missing");
    process.exit(0);
  }

  if (!port) {
    port = 27017;
  }
  let url = `mongodb://${host}:${port}/${dbname}`;
  mongoose.connect(url, options);

  mongoose.connection.on('error', function(err) {
    console.log("error on db", err);
  });

  mongoose.connection.on("connected", function() {
    console.log("db connection successfully ");
  });

  mongoose.connection.on("disconnected", function(err) {
    console.log("db disconnected ", err);
  });

};

const disconnectDB = () => {
  mongoose.connection.close();
};

module.exports = {
  connectDB,
  disconnectDB
}