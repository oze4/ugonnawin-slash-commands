const fetch = require('node-fetch');

function getRandomElementFromArray (arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

exports.getRandomElementFromArray;

exports.botResponse = (jsonResponse, channel) => {
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

const getRandomPostsFromSubReddit = async (subreddit) => {
    return fetch(`https://www.reddit.com/r/${subreddit}/.json?limit=100`)
        .then(res => res.json())
        .then(json => getRandomElementFromArray(json.data.children))
        .catch(err => {
            throw err;
        });
}

exports.getRandomPicFromSubreddit = (subreddit, callback) => {
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

exports.makeSlackImageAttachment = (url, fallback = null) => {
    return {
        "attachments": [{
            "fallback": fallback === null ? url : fallback,
            "image_url": url
        }]
    }
}

exports.isTittyEvent = (text, id = userIDs.BOBBY_BOT) => {
    return [
        `${id} tiddies`,
        `${id} tits`,
        `${id} boobs`,
        `${id} titties`,
    ].includes(text);
}

exports.isCatEvent = (text, id = userIDs.BOBBY_BOT) => {
    return [
        `${id} cat`,
        `${id} kittie`,
        `${id} cats`,
        `${id} kitten`,
    ].includes(text);
}

exports.salutations = [
    "Hello",
    "Whats the deal",
    "What up",
    "How's it going",
    "Say",
    "Whats crack-a-lackin",
    "Pull my finger",
    "WAAAAAZZZZUPPPP"
];

exports.types = {
    APP_MENTION: "app_mention",
    MESSAGE: "message"
}

exports.channels = {
    BOBBIES_BOOBIES: 'CPHDX86DA'
}

exports.userIDs = {
    BOBBY_BOT: 'UPKCHH806'
}

exports.subreddits = {
    TITS: 'tits',
    CATS: 'cats',
}