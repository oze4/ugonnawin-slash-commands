let config;


try {
    
    config = require('../config/config.js')
    
} catch {
    
    config = {

        app: {
            port: process.env.PORT,
        },
        
        slack: {
            appId: process.env.APP_ID,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            signingSecret: process.env.SIGNING_SECRET,
            verificationToken: process.env.VERIFICATION_TOKEN
        },

    }
    
}


module.exports = config;