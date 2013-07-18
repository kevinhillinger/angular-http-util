var express = require('express');
var fs = require('fs');
var open = require('open');

var MemoryStorage = require('./storage').Memory;

var API_URL = '/api/people';
var API_URL_ID = API_URL + '/:id';

exports.start = function(PORTS, STATIC_DIR, DATA_FILE) {
    var app = express();
    var storage = new MemoryStorage();

    var listenOn = function (options) {
        var url = 'http://localhost:' + options.port + '/';

        app.listen(options.port, function () {
            if (options.open) {
                open(url);
            }
            console.log(url);
        });
    };

    //CORS SUPPORT
    var corsConfig = function (req, res, next) {
        res.header('Access-Control-Allow-Origin', "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
            res.send(200);
        }
        else {
            next();
        }
    };

    app.use(corsConfig);
    app.use(express.logger('dev'));
    app.use(express.static(STATIC_DIR));
    app.use(express.bodyParser());

    // API
    app.get(API_URL, function(req, res, next) {
        res.send(200, storage.getAll());
    });

    app.get(API_URL_ID, function(req, res, next) {
        var item = storage.getById(req.params.id);

        if (item) {
            return res.send(200, item);
        }

        return res.send(400, {error: 'No person with id "' + req.params.id + '"!'});
    });
    
    // start the server
    // read the data from json and start the server
    fs.readFile(DATA_FILE, function (err, stream) {
        var data = JSON.parse(stream);

        data.forEach(function (person) {
            storage.add(person);
        });

        listenOn({ port: PORTS.SITE, open: true });
        listenOn({ port: PORTS.SERVER, open: false });
    });

    try {
        process.on('SIGINT', function() {});
    } catch (e) {}

};
