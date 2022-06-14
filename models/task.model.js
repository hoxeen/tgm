module.exports = (sequelize, Sequelize) => {
    const Task = sequelize.define("tasks", {
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        deadline: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        priority: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING
        },
        responsible: {
            type: Sequelize.STRING
        },
        creator: {
            type: Sequelize.STRING
        }
    });
    return Task;
};