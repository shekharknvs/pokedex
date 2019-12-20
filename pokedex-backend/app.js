const createError = require('http-errors');
  express = require('express'),
  http = require("http"),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  helmet = require("helmet"),
  db = require("./db"),
  cors = require("cors"),
  config = require("./config"),
  router = require('./routes/index'),

  app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors())
app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


router(app);

http.createServer(app).listen(5000, ()=>{
  console.log("listening at 5000 ");
  console.log(db.connectDB);
  const { host, port, dbname} = config.db;
  db.connectDB(host, port, dbname, {});
})

module.exports = app;
