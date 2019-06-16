/**
 * 
 * Routes for POST /link/__
 * 
 */

const express = require('express');
const router  = express.Router();


router.post('/new', (req, res) => {
    console.log("------------ req.body ---------------");
    console.log(req.body);
    console.log("----------- end req.body ------------\r\n\r\n");
    console.log("------------ req.headers ---------------");
    console.log(req.headers);
    console.log("----------- end req.headers ------------\r\n\r\n");
    res.status(200).send('10-4');
});


module.exports = router;
