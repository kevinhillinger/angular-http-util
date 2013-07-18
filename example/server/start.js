var STATIC_DIR = __dirname + '/../../example';
var DATA_FILE = __dirname + '/data/people.json';

var PORTS = {
    SERVER: process.argv[2] && parseInt(process.argv[2], 10) || 3001,
    SITE: 3000
};

require('./index').start(PORTS, STATIC_DIR, DATA_FILE);
