const { Router } = require("express");
const { UserModel } = require("../model/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userRouter = Router();

userRouter.post("/register", async (req, res) => {
    const { name, email, pass, age } = req.body;
    try {
        bcrypt.hash(pass, 5, async (err, hash) => {
            // Store hash in your password DB.
            const user = new UserModel({ name, email, age, pass: hash });
            await user.save();
            res.status(200).send({ msg: "New user has been registered" });
        });
    } catch (error) {
        res.status(400).send({ err: err.message });
    }
});

userRouter.post("/login", async (req, res) => {
    // email & pass we will get it from frontend
    const { email, pass } = req.body;
    try {
        const user = await UserModel.findOne({ email });

        if (user) {
            bcrypt.compare(pass, user.pass, async (err, result) => {
                if (result) {
                    const token = jwt.sign(
                        { authorID: user._id, author: user.name },
                        "masai",
                        {
                            expiresIn: "1h",
                        }
                    );
                    res.status(200).send({
                        msg: "Login Successful",
                        token: token,
                    });
                } else {
                    res.status(200).send({ msg: "Wrong Credentials" });
                }
            });
        } else {
            res.status(200).send({ msg: "Wrong Credentials" });
        }
    } catch (error) {
        res.status(400).send({ err: err.message });
    }
});

module.exports = { userRouter };
