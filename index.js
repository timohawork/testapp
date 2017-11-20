var app = {
    config: require('./config'),
    fs: require('fs')
};

var server = require("./server")(app);