const fetch = require('node-fetch');

function getRandomElementFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

async function getRandomPostsFromSubReddit(subreddit) {
    return fetch(`https://www.reddit.com/r/${subreddit}/.json?limit=100`)
        .then(res => res.json())
        .then(json => getRandomElementFromArray(json.data.children))
        .catch(err => {
            throw err;
        });
}

const salutations = [
    "Hello",
    "Whats the deal",
    "What up",
    "How's it going",
    "Say",
    "Whats crack-a-lackin",
    "Pull my finger",
    "WAAAAAZZZZUPPPP"
];

const slackEventType = {
    APP_MENTION: "app_mention",
    MESSAGE: "message"
}

const channel = {
    BOBBIES_BOOBIES: 'CPHDX86DA'
}

const userID = {
    BOBBY_BOT: 'UPKCHH806'
}

const subreddit = {
    TITS: 'tits',
    CATS: 'cats',
}

function getRandomPicFromSubreddit(subreddit, callback) {
    getRandomPostsFromSubReddit(subreddit)
        .then(r => {
            r.data.url.endsWith('jpg') ?
                callback(r.data.url) :
                getRandomPicFromSubreddit(subreddit, callback)
        })
        .catch(e => {
            throw e
        });
}

function botResponse(jsonResponse, channel) {
    try {
        fetch("https://slack.com/api/chat.postMessage", {
            method: 'POST',
            headers: {
                'Content-type': "application/json",
                'Authorization': `Bearer ${process.env.BOT_OAUTH_ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                ...jsonResponse,
                channel
            }),
        });
    } catch (err) {
        console.log("Something went wrong!", err);
    }
}

function makeSlackImageAttachment(url, fallback = null) {
    return {
        "attachments": [{
            "fallback": fallback === null ? url : fallback,
            "image_url": url
        }]
    }
}

function isMessageFromSpecificIdAndIncludesSpecificWord(id, words, message) {
    let _id = `<@${id}>`,
        result = false;
    if (message.startsWith(_id)) {
        for (let i = 0; i < words.length; i++) {
            if (message.includes(words[i])) {
                result = true;
                break;
            }
        }
    }
    return result;
}

module.exports = {
    getRandomElementFromArray,
    botResponse,
    getRandomPicFromSubreddit,
    makeSlackImageAttachment,
    isMessageFromSpecificIdAndIncludesSpecificWord,
    salutations,
    slackEventType,
    channel,
    subreddit,
    userID,
}