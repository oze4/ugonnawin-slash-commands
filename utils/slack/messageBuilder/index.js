// Slack module to assist in building messages

'use strict'
const SlackBlockSelectOption = require('./SlackBlockSelectOption.js');


const slackMessages = {
    /**
     * @param  {Express.request} request
     * @param  {String} mainText
     *     Text to display along with the button
     */
    linkWithButton(request, mainText) {
        let stageBodyText = request.body.text;
        let preBodyText = stageBodyText.trim();
        let finalUrl = preBodyText.startsWith("http") ? preBodyText : "http://" + preBodyText;
        let finalBtnText = finalUrl.substring(0, 75) // Can only be 75 chars long
        let message = {
            response_type: "in_channel",
            blocks: [{
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
            }]
        };
        return JSON.parse(JSON.stringify(message));
    },

    /**
     * @param  {String} text
     * @param  {String} selectPlaceholder
     *     Place holder to be shown before a selection is made
     * @param  {Array<{text: String, value: String}>} selectOptions
     *     Must be an object that has a text and value property - both properties should be a String
     */
    textWithSelect(text, selectPlaceholder, selectOptions) {
        let message = {
            response_type: "in_channel",
            blocks: [{
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: text //"Please select a location:" 
                },
                accessory: {
                    type: "static_select",
                    placeholder: {
                        type: "plain_text",
                        text: selectPlaceholder,
                        emoji: true
                    },
                    options: []
                },
            }, ]
        };
        selectOptions.forEach(option => {
            let o = new SlackBlockSelectOption(option.text, option.value);
            message.blocks[0].accessory.options.push(o.toJson());
        });

        return JSON.parse(JSON.stringify(message));
    },


    /**
     * @param  {Express.request} request
     * @param  {String} mainMessage
     */
    textToLink(request, mainMessage) {
        let bodyText = request.body.text.trim();
        let finalBody = bodyText.startsWith("http") ? bodyText : "http://" + bodyText;
        let message = {
            response_type: "in_channel",
            blocks: [{
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
                        text: "<" + finalBody + " | " + bodyText + ">"
                    }
                }
            ]
        };
        return JSON.parse(JSON.stringify(message));
    },


    /**
     * @param  {String} city
     * @param  {String|Number} temp
     * @param  {String} description
     * @param  {String} iconUrl
     * @param  {String} extraText=null
     */
    currentWeather(city, temp, description, iconUrl, extraText = null) {
        let degreeSymbol = "°";
        let listSymbol = "•";
        let desc = titleCase(String(description));
        let weatherText = "Current weather for *" + city + "*:\n\n  " + listSymbol + " " + temp + degreeSymbol + "F\n  " + listSymbol + " " + desc;
        let message = {
            response_type: "ephemeral",
            blocks: [{
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
            }]
        };
        if (extraText !== null) {
            message.blocks.push({
                type: "context",
                elements: [{
                    type: "mrkdwn",
                    text: extraText
                }]
            })
        }
        return JSON.parse(JSON.stringify(message));
    },

    invalidUrlResponse() {
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
        return invalidResponses[Math.floor(Math.random() * invalidResponses.length)];
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