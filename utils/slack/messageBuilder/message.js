// Slack module to assist in building messages

'use strict'


const slackMessages = {
    linkWithButton (request, mainText) {
        let stageBodyText = request.body.text;
        let preBodyText = stageBodyText.trim();
        let finalBody = preBodyText.startsWith("http") ? preBodyText : "http://" + preBodyText;
        let message = {
            channel: request.body.channel_id,
            response_type: "in_channel",
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: mainText
                    },
                    accessory: {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: finalBody,
                            emoji: true
                        },
                        url: finalBody
                    }
                }
            ]
        };
        return JSON.parse(JSON.stringify(message));  
    },

    textToLink (request, mainMessage) {
        let bodyText = request.body.text;
        let message = {
            channel: request.body.channel_id,
            response_type: "in_channel",
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: mainMessage 
                    }
                },
                {
                    type: "divider"
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: "<"+ bodyText.trim() +" | "+ bodyText.trim() +">"
                    }
                }
            ]
        };
        return JSON.parse(JSON.stringify(message));        
    },

    invalidUrlResponse () {
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
