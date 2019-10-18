'use strict'
const express = require('express');
const router = express.Router();
const middleware = require('../../utils/middleware.js');
const slack = require('../../utils/slack');
const MongoBot = require('../../utils/mongobot');

// Middleware to verify request is from Slack.
router.use(middleware.request.verifySlackRequest);


/**
 * @route /db/save
 */
router.post('/save', (req, res, next) => {
    const constants = {
        TEXT: req.body.text,
        USER_ID: req.body.user_id
    }

    let dataToSave = {
        user: constants.USER_ID,
        data: constants.TEXT,
        timestamp: new Date(),
    }

    MongoBot.db.collection(process.env.MONGO_COLLECTION).insertOne(dataToSave, (err, result) => {
        if (err) {
            res.status(200).send("Unable to save message :cry: Please try again later.");
        }

        if (result) {
            res.status(200).send(":tada: Message saved successfully! :tada:")
        }
    });
})

/**
 * @route /db/get
 */
router.post('/get', (req, res, next) => {
    const constants = {
        RESPONSE_URL: req.body.response_url,
    }

    MongoBot.db.collection(process.env.MONGO_COLLECTION).find({}).toArray((err, result) => {
        if (err) {
            console.log(err);
            res.status(200).send("Unable to get saved messages at this time :cry:");
        }
        if (result) {
            res.status(200).send(JSON.stringify(result, null, 2));
        }
    })
})

module.exports = router;