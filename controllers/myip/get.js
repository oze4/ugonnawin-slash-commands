'use strict'
const express = require('express');
const router  = express.Router();


////////////////////////////
// ROUTE: /myip
////////////////////////////
router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({ ip: req.headers['x-real-ip'] }));
})


module.exports = router;