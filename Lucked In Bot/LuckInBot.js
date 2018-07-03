require('dotenv').config();
const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');

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
    subreddit: 'all',
    results: 100,
    pollTime: 2500  
};

// Create a Snoostorm CommentStream with the specified options
const comments = client.CommentStream(streamOpts);

// On comment, perform whatever logic you want to do
comments.on('comment', (comment) => {
//console.log(comment);

if  (isSubstring(comment.body,'best of luck') || isSubstring(comment.body,'To [luck out] or [succeed through luck] is American English colloquial. It can be interchanged to have a greater golbal presence. To [Lucked in] is an Australian phrase.') || isSubstring(comment.body,'To [luck out] or [succeed through luck] is American English colloquial, but did you know that [Lucked in] is an Australian alternative phrasing ?'))
{
console.log('self trigger!');
}
else{
if (isSubstring(comment.body,'lucked in') || (isSubstring(comment.body,'luck in') & !isSubstring(comment.body,'good luck in')))
{
    comment.reply('To [luck out] or [succeed through luck] is American English colloquial. It can be interchanged to have a greater golbal presence. To [Lucked in] is an Australian phrase.');
    ReplyCount++;
    console.log(comment.body);
}


if (isSubstring(comment.body,'lucked out') || isSubstring(comment.body,'luck out') || isSubstring(comment.body,'succeed through luck') )
{
    comment.reply('To [luck out] or [succeed through luck] is American English colloquial, but did you know that [Lucked in] is an Australian alternative phrasing ?');
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