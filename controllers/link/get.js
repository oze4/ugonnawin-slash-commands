// Routes for GET /link/__ 

'use strict'
const express = require('express');
const router  = express.Router();


router.get('/sanity', (req, res) => {
    res.status(404).send("Hmmm.. can't find that..");
    // UNCOMMENT IF YOU WANT TO ACTUALLY CHECK IF ROUTES ARE WORKING
    // * this was used to verify routes were up *
    // res.send('Sanity Check');
})


module.exports = router;
