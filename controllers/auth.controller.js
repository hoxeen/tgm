const db = require("../models/index");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");
exports.signup = (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).send({
            errors: errors.array(),
            message: 'Incorrect data'
        })
    } else {
    User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        patronymic: req.body.patronymic,
        login: req.body.login,
        password: bcrypt.hashSync(req.body.password, 8)
    })
        .then(user => {
            if(res.statusCode==200) {
            req.body.roles=req.body.roles.toLowerCase()
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: [req.body.roles]
                        }
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        res.send({ message: "User was registered successfully!" });
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    }
};
exports.signin = (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).send({
            errors: errors.array(),
            message: 'Incorrect data'
        })
    } else {
        User.findOne({
            where: {
                login: req.body.login
            }
        })
            .then(user => {
                if (!user) {
                    return res.status(404).send({message: "User Not found."});
                }
                var passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                );
                if (!passwordIsValid) {
                    return res.status(401).send({
                        accessToken: null,
                        message: "Invalid Password!"
                    });
                }
                var token = jwt.sign({id: user.id}, config.secret, {
                    expiresIn: 86400 // 24 hours
                });

                var authorities = '';
                user.getRoles().then(roles => {

                    authorities=roles[0].name.toLowerCase();
                    // authorities=[]
                    // for (let i = 0; i < roles.length; i++) {
                    //     authorities.push(roles[i].name.toLowerCase());
                    // }
                    res.json({token, userId: user.id, roles: authorities, login: req.body.login})

                    // res.status(200).send({
                    //     id: user.id,
                    //     firstname: req.body.firstname,
                    //     lastname: req.body.lastname,
                    //     patronymic: req.body.patronymic,
                    //     login: user.login,
                    //     roles: authorities,
                    //     accessToken: token
                    // });
                });
            })
            .catch(err => {
                res.status(500).send({message: err.message});
            });
    }
};