const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicate = (req, res, next) => {
    User.findOne({
        username: req.body.username
    }).exec((error, user) => {
        if (error) {
            res.status(500).send({ message: error });
        }

        if (user) {
            res.status(400).send({ message: 'Username is already in use!'})
        }

        User.findOne({
            email: req.body.email
        }).exec((error, user) => {
            if (error) {
                res.status(500).send({ message: error });
            }

            if (user) {
                res.status(400).send({ message: 'Email is already in use!'})
            }
        })
    })
};

module.exports = {
    checkDuplicate
};
