const { verifySignUp } = require("../middleware");
const controller = require("../controllers/task.controller");
// const {check} = require("express-validator");
module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/task/create",
        [],
        controller.create
    );
    app.post(
        `/api/task/get/`,
        [],
        controller.get
    );
    app.post(
        `/api/task/getdr/`,
        [],
        controller.getDateRange
    );
    app.post(
        `/api/task/update/`,
        [],
        controller.update
    );
};