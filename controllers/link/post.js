/**
 * 
 * Routes for POST /link/__
 * 
 */

const express = require('express');
const router  = express.Router();


router.post('/new', (req, res) => {
    console.log(req);
    res.status(200).send('10-4');
});


module.exports = router;
