const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const {validationResult} = require('express-validator')

checkDuplicateLogin = (req, res, next) => {
    if(validationResult(req).isEmpty()) {
        // Username
        User.findOne({
            where: {
                login: req.body.login
            }
        }).then(user => {
            if (user) {
                res.status(400).send({
                    message: "Failed! Login is already in use!"
                });
                return;
            } else {
                res.status(200)
            }

        });
    }
        next();

};
// checkRolesExisted = (req, res, next) => {
//     if(validationResult(req).isEmpty()) {
//         if (req.body.roles) {
//             // for (let i = 0; i < req.body.roles.length; i++) {
//             //     console.log(req.body)
//                 if (!ROLES.includes(req.body.roles.toLowerCase())) {
//                     res.status(400).send({
//                         message: "Failed! Role does not exist = " + req.body.roles[i]
//                     });
//                     return;
//                 }
//             // }
//         }
//     }
//
//     next();
// };
const verifySignUp = {
    checkDuplicateLogin,
    // checkRolesExisted
};
module.exports = verifySignUp;