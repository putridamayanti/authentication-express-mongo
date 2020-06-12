const { check } = require("express-validator");


module.exports = (app) => {
    const user = require("../controllers/user.controller");

    var router = require("express").Router();

    router.get("/", user.findAll);
    router.post("/", [
        check("username", "Please Enter a Valid Username")
            .not()
            .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ], user.create);
    router.post("/login", user.login);

    app.use("/api/user", router);
};
