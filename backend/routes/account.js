const express = require('express')
const { authMiddleware } = require('../middleware')
const { Account } = require('../db')
const mongoose = require('mongoose')
const zod = require('zod')
const router = express.Router()

const transferBody = zod.object({
    to: zod.string(),
    amount: zod.number()
})

router.get('/balance', authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    return res.status(200).json({
        balance: account.balance
    })
})

router.post("/transfer", authMiddleware, async (req, res) => {

    const account = await Account.findOne({
        userId: req.userId
    });

    if (account.balance < req.body.amount) {
        return res.status(400).json({
            message: "Insufficient balance"
        })
    }

    const toAccount = await Account.findOne({
        userId: req.body.to
    });

    if (!toAccount) {
        return res.status(400).json({
            message: "Invalid account"
        })
    }

    await Account.updateOne({
        userId: req.userId
    }, {
        $inc: {
            balance: -req.body.amount
        }
    })

    await Account.updateOne({
        userId: req.body.to
    }, {
        $inc: {
            balance: req.body.amount
        }
    })

    res.json({
        message: "Transfer successful"
    })
});

module.exports = router