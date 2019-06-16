/**
 * 
 * Routes for POST /link/__
 * 
 */

const express    = require('express');
const router     = express.Router();
const middleware = require('../../utils/middleware.js');



router.use(middleware.request.verifySlackRequest);

router.post('/new', (req, res) => {
    res.status(200).send(req.body.text);
});


module.exports = router;
