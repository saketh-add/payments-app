const express = require('express');
const router = express.Router();
const zod = require('zod');
const jwt = require('jsonwebtoken');
const { User, Account } = require('../db');
const { JWT_SECRET } = require('../config');
const { authMiddleware } = require('../middleware');

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

const updateBody = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})

router.post('/signup', async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Invalid Inputs"
        })
        return
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        res.status(411).json({
            message: "Email already taken"
        })
        return
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })

    const userId = user._id;

    await Account.create({
        userId: userId,
        balance: Math.floor(1 + Math.random() * 10000)
    })

    const token = jwt.sign({
        userId: userId
    }, JWT_SECRET);

    return res.status(200).json({
        message: "User created successfully",
        token: token
    })
})

router.post('/signin', async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "Invalid username/password"
        })
        return
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (!user) {
        res.status(400).json({
            message: "Error while signing in. Invalid username/password"
        })
        return
    }

    const userId = user._id;
    const token = jwt.sign({
        userId: userId
    }, JWT_SECRET);

    return res.status(200).json({
        token: token
    })
})

router.put("/", authMiddleware, async (req, res) => {
    const success = updateBody.safeParse(req.body);
    if (!success) {
        res.status(400).json({
            message: "Error while updating information"
        })
        return
    }

    await User.updateOne(req.body, {
        _id: req.userId
    })

    return res.status(200).json({
        message: "User updated successfully"
    })
})

router.get('/bulk', authMiddleware, async (req, res) => {
    const filter = req.query.filter || ""

    const userId = req.userId;

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter,
                '$options': 'i'
            }
        }, {
            lastName: {
                "$regex": filter,
                '$options': 'i'
            }
        }]
    })

    return res.status(200).json({
        users: users.filter(user => {
            return user._id != userId
        }).map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
})

router.get('/details', authMiddleware, async (req, res) => {
    const userId = req.userId;
    const user = await User.findOne({
        _id: userId
    })

    return res.status(200).json({
        firstName: user.firstName,
        lasName: user.lastName
    });
})

module.exports = router;