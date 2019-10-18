'use strict'
const express = require('express');
const router = express.Router();
const middleware = require('../../utils/middleware.js');

router.use(middleware.request.allowCors);

/**
 * @route /myip
 * @description Returns your public IP to you
 */
router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({
        ip: req.headers['x-real-ip']
    }));
})

module.exports = router;