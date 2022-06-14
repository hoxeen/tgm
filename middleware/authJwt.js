const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        next();
    });
};
isUser = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "user") {
                    next();
                    return;
                }
            }
            res.status(403).send({
                message: "Требуется роль пользователя!"
            });
            return;
        });
    });
};
isSupervisor = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                console.log('roles[i].name', roles[i].name)
                if (roles[i].name === "supervisor") {
                    next();
                    return;
                }
            }
            res.status(403).send({
                message: "Требуется роль руководителя!"
            });
        });
    });
};
isUserOrSupervisor = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "руководитель") {
                    next();
                    return;
                }
                if (roles[i].name === "пользователь") {
                    next();
                    return;
                }
            }
            res.status(403).send({
                message: "Требуется пользователь или руководитель"
            });
        });
    });
};
const authJwt = {
    verifyToken,
    isUser,
    isSupervisor,
    isUserOrSupervisor
};
module.exports = authJwt;