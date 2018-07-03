require('dotenv').config();
const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');
const Squanch = require('squanch');

let CommentCount = 0;
let ReplyCount = 0;

// Build Snoowrap and Snoostorm clients
const r = new Snoowrap({
    userAgent: 'reddit-bot-example-node',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
});
const client = new Snoostorm(r);

// Configure options for stream: subreddit & results per query
const streamOpts = {
    subreddit: 'rickandmorty',
    results: 100,
    pollTime: 60000  
};

// Create a Snoostorm CommentStream with the specified options
const comments = client.CommentStream(streamOpts);

// On comment, perform whatever logic you want to do
comments.on('comment', (comment) => {
//console.log(comment);
//console.log(Squanch(comment.body));

//author: RedditUser { name: 'Smash_Palace' },
//console.log(comment.author);

if  (comment.author === "RedditUser { name: '" + process.env.REDDIT_USER +"' }")
{
    console.log('self trigger!');
}
else{
    if (isSubstring(comment.body,'squanch'))
    {
        comment.reply(Squanch(comment.body) + '  -  Squanch Bot');
        ReplyCount++;
        console.log(comment.body);
    }
}

CommentCount++;

if(CommentCount % 1000 == 0)
    {
        console.log('Comments viewed ' + CommentCount +', total replies ' + ReplyCount);
    }
});

function isSubstring(str, str_to_match) {
    return (str.toLowerCase().indexOf(str_to_match.toLowerCase()) > -1);
}