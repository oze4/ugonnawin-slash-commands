// Slack module to assist in building messages

'use strict'


const slackMessages = {
    linkWithButton (request, mainText) {
        let stageBodyText = request.body.text;
        let preBodyText   = stageBodyText.trim();
        let preFinalBody  = preBodyText.startsWith("http") ? preBodyText : "http://" + preBodyText;
        let finalBody     = preFinalBody.substring(0, 75) // Can only be 75 chars long
        let message = {
            channel: request.body.channel_id,
            response_type: "in_channel",
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "plain_text",
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

    currentWeather (city, temp, description, iconUrl) {
        let degreeSymbol = "°";
        let listSymbol = "•";
        let desc = titleCase(String(description));
        let weatherText = "Current weather for *" + city + "*:\n  " + listSymbol + " " + temp + degreeSymbol + "\n  " + listSymbol + " " + desc;
        let message = {
            response_type: "ephemeral",
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: weatherText
                    },
                    accessory: {
                        type: "image",
                        image_url: iconUrl,
                        alt_text: desc
                    }
                }
            ]
        };
        console.log(JSON.stringify(message));
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


function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' '); 
 }


module.exports = slackMessages;
