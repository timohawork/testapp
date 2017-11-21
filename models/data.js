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
        text: {
            type: Sequelize.TEXT,
            validate: {
                latin_strings() {
                    if (/[a-zA-Z]/.test(this.text))
                        throw new Error('String with english symbols:', this.text);
                }
            }
        },
        createdAt: Sequelize.DATE,
        userId: {
            type: Sequelize.INTEGER,
            references: {
                model: app.model.user,
                key: 'id'
            }
        }
    });

    return model;
};