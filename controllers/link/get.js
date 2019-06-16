/**
 * Routes for GET /link/__
 * 
 * This is really only here for a 'sanity check' to make sure the /link route ~
 * ~ is actually working.
 * 
 */
'use strict'
const express = require('express');
const router  = express.Router();


router.get('/sanity', (req, res) => {
    res.send('Sanity Check');
})


module.exports = router;
