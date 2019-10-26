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

const types = {
    APP_MENTION: "app_mention",
    MESSAGE: "message"
}

const channels = {
    BOBBIES_BOOBIES: 'CPHDX86DA'
}

const userIDs = {
    BOBBY_BOT: 'UPKCHH806'
}

const subreddits = {
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

function isTittyEvent(text, id = userIDs.BOBBY_BOT) {
    let _id = `<@${id}>`;
    return [
        `${_id} tiddies`,
        `${_id} tits`,
        `${_id} boobs`,
        `${_id} titties`,
    ].includes(text);
}

function isCatEvent(text, id = userIDs.BOBBY_BOT) {
    let _id = `<@${id}>`;
    return [
        `${_id} cat`,
        `${_id} kittie`,
        `${_id} cats`,
        `${_id} kitten`,
    ].includes(text);
}


module.exports = {
    getRandomElementFromArray,
    botResponse,
    getRandomPicFromSubreddit,
    makeSlackImageAttachment,
    isTittyEvent,
    isCatEvent,
    salutations,
    types,
    channels,
    subreddits,
}