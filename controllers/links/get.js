/**
 * Routes for GET /links/__
 */

const express = require('express');
const router  = express.Router();


router.get('/sanity', (req, res) => {
    res.send('Sanity Check');
})


module.exports = router;