// Slack module to assist in building messages

'use strict'


const slackMessages = {
    newUrlToButtonMessage (request, text) {
        let isValidUrl = request.body.text.startsWith("http://") || request.body.text.startsWith("https://");
        let url = isValidUrl ? request.body.text : `http://${request.body.text}`;
        let jsonMessage = {
            "response_type": "in_channel",
            "text": ""+ text +"",
            "attachments": [
                {
                    "fallback": ""+ request.body.text +"",
                    "actions": [
                        {
                            "text": ""+ url +"",
                            "type": "button",
                            "url": ""+ url +""
                        }
                    ]
                }
            ]
        };
        return jsonMessage;
    },

    getInvalidUrlResponse () {
        const invalidResponses = [
            "Hmmm.. that doesn't seem to be a valid URL..",
            "Gimme a URL!",
            "Please supply a valid URL for me to link!",
            "Need....valid.....URLs....",
            "That URL doesn't pass the smell test...",
            "If it walks like a string, talks like a string, it isn't a valid URL!",
            "C'MON gimme something to work with...that is an invalid URL",
            "You call that a URL?"
        ];
        return invalidResponses[Math.floor(Math.random()*invalidResponses.length)];
    }
}


module.exports = slackMessages;