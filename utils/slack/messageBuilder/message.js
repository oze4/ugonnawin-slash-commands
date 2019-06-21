// Slack module to assist in building messages

'use strict'


const slackMessages = {
    linkWithButton (request, mainText) {
        let stageBodyText = request.body.text;
        let preBodyText   = stageBodyText.trim();
        let finalUrl      = preBodyText.startsWith("http") ? preBodyText : "http://" + preBodyText;
        let finalBtnText  = finalUrl.substring(0, 75) // Can only be 75 chars long
        let message = {
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
                            text: finalBtnText,
                        },
                        url: finalUrl
                    }
                }
            ]
        };
        return JSON.parse(JSON.stringify(message));  
    },

    textToLink (request, mainMessage) {
        let bodyText = request.body.text.trim();
        let finalBody = bodyText.startsWith("http") ? bodyText : "http://" + bodyText;
        let message = {
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
                        text: "<"+ finalBody +" | "+ bodyText +">"
                    }
                }
            ]
        };
        return JSON.parse(JSON.stringify(message));        
    },

    currentWeather (city, temp, description, iconUrl, extraText = null) {
        let degreeSymbol = "°";
        let listSymbol = "•";
        let desc = titleCase(String(description));
        let weatherText = "Current weather for *" + city + "*:\n\n  " + listSymbol + " " + temp + degreeSymbol + "F\n  " + listSymbol + " " + desc;
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
        if (extraText !== null) {
            message.blocks.push({
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: extraText
                    }
                ]
            })
        }
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
