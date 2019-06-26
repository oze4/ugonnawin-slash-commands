'use strict'
const express = require('express');
const router  = express.Router();
const request = require('request');


////////////////////////////
// ROUTE: /myip
////////////////////////////
router.get('/', (req, res) => {
    res.status(200).send('ok');
})


module.exports = router;