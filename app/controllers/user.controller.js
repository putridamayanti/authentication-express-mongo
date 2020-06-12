const { validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const db = require("../models");
const User = db.user;

exports.login = (req, res) => {
    User.findOne({
        username: req.body.username
    }).then((user) => {
        if (!user) {
            return res.status(500).send({
                status: 'failed',
                message: 'User not found!'
            });
        }

        const passwordValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordValid) {
            return res.status(401).send({
                status: 'failed',
                message: 'Wrong password!'
            });
        }

        const token = jwt.sign({ id: user.id }, "auth-secret-key", {
            expiresIn: 86400 // 24 hours
        });

        res.send({
            status: 'success',
            message: 'Successfully logged in!',
            token: token
        })

    }).catch((error) => {
        return res.status(500).send({
            status: 'failed',
            message: error.message || "Something error!"
        })
    });
};

exports.findAll = (req, res) => {
    User.find()
        .then(result => {
            res.send({
                status: 'success',
                message: 'Successfully fetch data!',
                data: result
            })
        })
        .catch(error => {
            res.status(500).send({
                message: error.message || "Something error!"
            })
        })
};

exports.create = (req, res) => {
    const errors = validationResult(req);

    let errorMessage = [];
    if (!errors.isEmpty()) {
        errors.array().forEach(item => {
            errorMessage.push({
                field: item['param'],
                message: item['msg']
            });
        });
        return res.status(400).json({
            status: 'failed',
            errors: errorMessage
        });
    }

    const requestBody = req.body;
    const user = new User({
        username: requestBody.username,
        email: requestBody.email,
        password: bcrypt.hashSync(requestBody.password, 8)
    });

    user.save(user)
        .then(result => {
            res.send({
                status: 'success',
                message: 'Successfully added data!',
                data: result
            })
        })
        .catch(error => {
            res.status(500).send({
                message: error.message || "Something error!"
            })
        })
};
