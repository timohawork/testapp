function DataController(app) {
    var self = {
        url: '/data',
        actions: {}
    };

    self.actions.upload = {
        method: 'post',
        do: (req, res) => {
            var post = req.body;
            console.log('post:', post);

            if (!post.token)
                return res.status(401);
            else {
                app.jwt.verify(post.token, app.config.front.secret, (err, decoded) => {
                    if (err) {
                        return res.status(401);
                    }
                    else {
                        if (!req.files || !req.files.file)
                            return res.json({error: 'No file was uploaded.'});

                        // TODO: req.files.file.mimetype check here

                        var name = req.files.file.name;
                        var path = './'+app.config.storage.files.uploads_dir+name;
                        req.files.file.mv(path, err => {
                            if (err) {
                                console.log(err);
                                return res.status(500).json({error: 'File uploading error'});
                            }

                            require('readline')
                                .createInterface({input: app.fs.createReadStream(path)})
                                .on('line', line => {
                                    app.model.data.create({
                                        filename: name,
                                        text: line,
                                        userId: decoded.id
                                    })
                                });

                            res.redirect('/data/list');
                        });
                    }
                });
            }
        }
    };

    self.actions.list = {
        method: 'get',
        url: '/list(/page/:page)?',
        do: (req, res) => {
            var page = req.params.page || 1;
            var limit = app.config.front.lines_per_page;

            app.model.data.count().then(total => {
                app.model.data.findAll({
                    limit: limit,
                    offset: (page - 1) * limit
                }).then(data => {
                    res.render('list', {
                        data: data,
                        total: total,
                        page: page*1,
                        pages: Math.ceil(total / limit)
                    });
                });
            });
        }
    };

    return self;
}

module.exports = DataController;