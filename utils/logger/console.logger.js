// FOR LOGGING THINGS TO THE CONSOLE

'use strict'


const consoleLogger = {
    headersAndbody (req, res, next) {
        console.log("~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*");
        console.log("~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*");
        console.log("----------------------- req.headers ------------------------------");
        console.log(req.headers);
        console.log("--------------------- end req.headers ----------------------------");
        console.log("------------------------- req.body -------------------------------");
        console.log(req.body);
        console.log("------------------------ end req.body ----------------------------");
        console.log("~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*");
        console.log("~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*~~*\r\n\r\n");
        next();
    },
}


module.exports = consoleLogger;
