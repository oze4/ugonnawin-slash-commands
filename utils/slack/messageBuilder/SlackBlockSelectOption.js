// Class to define select option drop down

'use strict'


class SlackBlockSelectOption {
    constructor (optionText, optionValue) {
        this.optionText = optionText;
        this.optionValue = optionValue;
    }

    static toJson () {
        return {
            text: {
                type: "plain_text",
                text: this.optionText,
                emoji: true,
            },
            value: this.optionValue
        }
    }
}


module.exports = SlackBlockSelectOption;
