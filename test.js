const fetch = require('node-fetch');

function getRandomElementFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

async function getRandomPostsFromSubReddit(subreddit) {
    return fetch(`https://www.reddit.com/r/${subreddit}/.json?limit=100`)
        .then(res => res.json())
        .then(json => getRandomElementFromArray(json.data.children))
        .catch(err => { throw err; });
}

function getRandomPicFromSubreddit(subreddit, callback) {
    getRandomPostsFromSubReddit(subreddit)
        .then(r => {
            r.data.url.endsWith('jpg')
                ? callback(r.data.url)
                : getRandomPicFromSubreddit(subreddit, callback)
        })
        .catch(e => { throw e });
}

getRandomPicFromSubreddit('tits', tit => console.log(tit))