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

                            res.json({success: true});
                        });
                    }
                });
            }
        }
    };

    return self;
}

module.exports = DataController;