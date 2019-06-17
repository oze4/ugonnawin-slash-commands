// HELPER FUNCTIONS
'use strict'


module.exports = {
    slack: {
        slash: {
            response: {
                buttonMessage (message, responseType) {
                    let resType = responseType !== 'in_channel' || 'ephemeral' ? 'in_channel' : responseType;
                    let jsonMessage = `
                    {
                        "response_type": "${resType}",
                        "text": "Click button to open URL",
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
        }
    },
}
