module.exports = app => {
    var model = app.sequelize.define('data', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        filename: {
            type: Sequelize.STRING,
            allowNull: false
        },
        createdAt: Sequelize.DATE,
        user_id: {
            type: Sequelize.INTEGER,
            references: {
                model: app.model.user,
                key: 'id'
            }
        }
    });

    return model;
};