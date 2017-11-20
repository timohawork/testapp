function IndexController(app) {
    var self = {
        url: '/index',
        actions: {}
    };

    self.actions.index = {
        method: 'get',
        url: '',
        do: (req, res) => {
            res.render('index', {
                title: app.config.front.title
            })
        }
    };

    self.actions.auth = {
        method: 'post',
        do: (req, res) => {
            var post = req.body;
            console.log('post:', post);
            app.model.user.findOne({where: {login: post.login}})
                .then(user => {
                    if (!user || user.password != post.password) {
                        res.json({error: 'Wrong user!'});
                        return;
                    }

                    res.json({token: app.jwt.sign({
                        login: user.login,
                        id: user.id
                    }, app.config.front.secret)});
                })
                .catch(err => {console.log(err)});
        }
    };

    return self;
}

module.exports = IndexController;