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
    res.status(200).end(); // have to send 200 within 3000ms

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
        if (err) throw err;

        console.log(result);
        //MongoBot.client.close();
    });
})

/**
 * @route /db/get
 */
router.post('/get', (req, res, next) => {
    res.status(200).end(); // have to send 200 within 3000ms

    const constants = {
        RESPONSE_URL: req.body.response_url,
    }

    MongoBot.db.collection(process.env.MONGO_COLLECTION).find({}).toArray((err, result) => {
        if (err) {
            console.log(err);
        }
        if (result) {
            console.log(result);
            //let response = JSON.stringify(result, null, 2);
            slack.api.post.jsonMessage(constants.RESPONSE_URL, result);
        }
        //MongoBot.client.close();
    })
})

module.exports = router;