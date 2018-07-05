require('dotenv').config();
const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');
var MongoClient = require('mongodb').MongoClient;

let CommentCount = 0;
let ReplyCount = 0;
let posts = [];

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
    pollTime: 10000  
};

// Create a Snoostorm CommentStream with the specified options
const comments = client.CommentStream(streamOpts);

// On comment, perform whatever logic you want to do
comments.on('comment', (comment) => {


//if (isSubstring(comment.body,'fragment to match'))
posts[posts.length] = comment;

CommentCount++;

if(CommentCount % 100 == 0)
    {
        console.log('Comments viewed ' + CommentCount);
			var url = 'mongodb://localhost/';

			MongoClient.connect(url, function(err, db) {
			useNewUrlParser: true;
			
			if (err) throw err;
			
			console.log('connected');

			var dbo = db.db("redditdb");
			dbo.collection("reddit").insertMany(posts, function(err, res) {
			if (err) throw err;
				console.log("Number of documents inserted: " + res.insertedCount);
                posts = [];
			});

             var cursor = dbo.collection('reddit').find();

           /* cursor.each(function(err, doc) {
                console.log(doc);
            });*/

			db.close();
            });
    }
});

function isSubstring(str, str_to_match) {
    return (str.toLowerCase().indexOf(str_to_match.toLowerCase()) > -1);
}