const bcrypt = require("bcrypt");
const auth = require("../auth");

const User = require("../models/User");

const createUser = async (req, res) => {
    try {
        
        if (!req.body.email.includes("@")) {
            return res.status(400).send({ error: "Email is not valid."});
        }

        if (req.body.password.length < 8) {
            return res.status(400).send({ error: "Password must be at least 8 characters."});
        }

        if (req.body.mobileNumber.length !== 11) {
            return res.status(400).send({ error: "Mobile number is not valid."});
        }

        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        const user = await newUser.save();
        return res.status(201).send({ message: "User created successfully."});

    } catch (error) {
        console.error("Error encountered while creating user", error);
        return res.status(500).send({ error: "Internal Server Error: Error occurred while creating user."});
    }
}

module.exports = {
    createUser
}