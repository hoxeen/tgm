const db = require("../models/index");
// const config = require("../config/auth.config");
const Task = db.task;
const {validationResult} = require("express-validator");
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const errors = validationResult(req)
    console.log('send', req)
    if(!errors.isEmpty()) {
        res.status(400).send({
            errors: errors.array(),
            message: 'Incorrect data'
        })
    } else {
        console.log('req.body',req.body)
        Task.create(req.body).then(() => {
            if(res.statusCode==200) {
                res.send({ message: "Task was created!" });
            }
        })
        .catch(err => {
            console.log(err.message)
            res.status(500).send({ message: err.message });
        });
    }
};

exports.get = (req, res) => {
    const condition=[]
    req.body.keys.map((key, i) =>{
        condition.push({[key]: {
                [Op.or]: [req.body.values[i]]
            }})
    })
    // console.log('req.body.attr',req.body.attr)
    Task.findAll({
        attributes: req.body.attr,
        where: condition,
        order: [['updatedAt', 'DESC']],
    }).then(resSql => {
        res.status(200).send(resSql)
    }).catch(err => {
        console.log(err.message)
        res.status(500).send({ message: err.message });
    });
};

exports.getDateRange = (req, res) => {
    const condition=[]

    // const condition=[]
    req.body.keys.map((key, i) =>{
        condition.push({[key]: {
                [Op.or]: [req.body.values[i]]
            }})
    })

    condition.push({
        createdAt: {
            [Op.between]: [
                req.body.start,
                req.body.end
            ]
        }})
    // console.log('req.body.attr',req.body.attr)
    Task.findAll({
        attributes: req.body.attr,
        where: condition,
        order: [['updatedAt', 'DESC']],
    }).then(resSql => {
        res.status(200).send(resSql)
    }).catch(err => {
        console.log(err.message)
        res.status(500).send({ message: err.message });
    });
};

exports.update = (req, res) => {
    const condition=[]
    req.body.keys.map((key, i) =>{
        condition.push({[key]: req.body.values[i]})
    })
    Task.update(
        req.body.obj,
        {where: condition}
        ).then(resSql => {
        res.status(200).send(resSql)
    }).catch(err => {
        console.log(err.message)
        res.status(500).send({ message: err.message });
    });
};