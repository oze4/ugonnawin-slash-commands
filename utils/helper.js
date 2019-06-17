// HELPER FUNCTIONS
'use strict'


module.exports = {
    messageAsJson (message, channelId) {
        let jsonMessage = `
        {
            "text": "Click button to open URL",
            "channel": "${channelId}",
            "attachments": [
                {
                    "fallback": "${String(message)}",
                    "actions": [
                        {
                            "type": "button",
                            "url": "${message}"
                        }
                    ]
                }
            ]
        }
        `;
        return JSON.stringify(JSON.parse(jsonMessage));
    }
}
