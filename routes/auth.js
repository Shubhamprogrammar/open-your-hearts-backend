const express = require("express")
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "Open Your Hearts";

router.post('/signup',
    [body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', "Enter a valid email").isEmail(),
    body('mobile', 'Enter a valid mobile number').isLength({ min: 10 }),
    body('password', "Password must be at least 8 characters long").isLength({ min: 8 }),
    ], async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ msg: "User with this email already exists" });
            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                password: secPass,
            });

            const data = {
                user: {
                    id: user.id,
                    name: user.name,
                }
            };
            success = true;

            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({ success, authToken, userId: user.id }); // Include userId in the response
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server Error Occurred");
        }
    }
);

router.post('/login', [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(req.body.password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        const data = {
            user: {
                id: user.id,
                name: user.name,
            }
        };
        success = true;

        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ success, authToken, userId: user.id }); // Include userId in the response
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error Occurred");
    }
});

module.exports=router;