const middleware = {
    route: {
        status: {
            fourzerofour(req, res, next) {
                res.status(404).send("Hmmm.. can't find that..")
            },
        }
    }
}

module.exports = middleware;
