global.Sequelize = require('sequelize');

var app = {
    config: require('./config'),
    fs: require('fs'),
    jwt: require('jsonwebtoken'),

    server: {},
    model: {}
};

app.sequelize = new Sequelize(
    app.config.storage.db.database,
    app.config.storage.db.user,
    app.config.storage.db.password,
    {
        host: app.config.storage.db.host,
        dialect: 'mysql',
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

app.sequelize
    .authenticate()
    .then(init)
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

function init() {
    app.fs.readdirSync('./models').forEach(file => {
        app.model[file.split('.')[0]] = require('./models/'+file)(app);
    });
    var server = require("./server")(app);
}