function IndexController(app) {
    var self = {
        url: '/index',
        actions: {}
    };

    self.actions.index = {
        method: 'get',
        url: '/index',
        do: (req, res) => {
            res.send('Index action here..');
        }
    };

    return self;
}

module.exports = IndexController;