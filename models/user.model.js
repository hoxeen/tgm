module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        firstname: {
            type: Sequelize.STRING
        },
        lastname: {
            type: Sequelize.STRING
        },
        patronymic: {
            type: Sequelize.STRING
        },
        login: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        }
    });
    return User;
};