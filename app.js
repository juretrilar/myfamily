let fs = require('fs');
let join = require('path').join;
let path = require('path');
let mongoose = require("mongoose");
let express = require('express');
let cookieParser = require('cookie-parser');
let favicon = require('serve-favicon');
let logger = require('morgan');
let bodyParser = require('body-parser');
let session = require("express-session");
let MongoStore = require("connect-mongo")(session);


const models = join(__dirname, './models');
fs.readdirSync(models)
    .filter(file => ~file.search(/^[^\.].*\.js$/))
    .forEach(file => require(join(models, file)));


let routes = require('./routes/routes');

let app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//demo seja
uporabnik_seja = {
    email : "test@test.si",
    id : 4,
    admin : true
};

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/npm', express.static(__dirname + '/node_modules/'));
app.use(session({
    secret : "THISISASECRETSTRING",
    saveUninitialized : true,
    resave : true,
    name : "myfamily",
    store : new MongoStore({mongooseConnection : mongoose.connection}),
    autoRemove : "native",
    cookie : {
        maxAge : 3600000
    }
}));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    console.log(err.message);
    res.status(err.status || 500);
    res.render('pages/error');
});

//esController(app);

app.listen(3000);

module.exports = app;