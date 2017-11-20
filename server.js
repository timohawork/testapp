function Server(app) {
    var bodyParser = require('body-parser');
    var express = require('express');
    var fileUpload = require('express-fileupload');

    var self = {
        express: express,
        server: express(),
        tpl: require('pug')
    };

    self.server.locals.basedir = app.config.web.basedir;
    self.server.set('view engine', 'pug');
    self.server.use(bodyParser.json());
    self.server.use(bodyParser.urlencoded({extended: true}));
    self.server.use(fileUpload());
    self.server.listen(
        app.config.web.port,
        app.config.web.host ? app.config.web.host : undefined,
        () => console.log('App listening on port '+app.config.web.port+'!')
    );
    self.server.use('/static', self.express.static('front'));

    app.fs.readdirSync('./controllers').forEach(file => {
        var controller = require('./controllers/'+file)(app);
        for (var name in controller.actions) {
            var action = controller.actions[name];
            self.server[action.method](controller.url+(action.url !== undefined ? action.url : '/'+name), action.do);
        }
    });

    return self;
}

module.exports = Server;