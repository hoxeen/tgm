const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const {check} = require("express-validator");
module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/auth/signup",
        [
            check('firstname','Мин. длина имя 2 символа').isLength({min:2}),
            check('lastname','Мин. длина фамилии 2 символа').isLength({min:2}),
            check('patronymic','Мин. длина отчества 2 символа').isLength({min:2}),
            check('login','Мин. длина логина 5 символов').isLength({min:5}),
            check('password','Мин. длина пароля 6 символов').isLength({min:6}),
            check('roles','Не выбрана роль').exists(),
            verifySignUp.checkDuplicateLogin,

        ],
        controller.signup
    );
    app.post("/api/auth/signin",
        [
            check('login','Мин. длина логина 5 символов').isLength({min:5}),
            check('password','Мин. длина пароля 6 символов').isLength({min:6})
        ],
        controller.signin);
};