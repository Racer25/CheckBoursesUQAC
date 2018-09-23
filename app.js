const request = require("request");
const config = require("./config");

let promiseSendSMS = function()
{
    return new Promise((resolve, reject)=>
    {
        request
            .get(
                "https://smsapi.free-mobile.fr/sendmsg?user="+config.user+"&pass="+config.pass+"&msg=Nouvelle(s)+bourses%21%21",
                function (err, httpResponse, body)
                {
                    if (err) {
                        console.error(err);
                        console.error(httpResponse);
                        reject(err);
                    }
                    else
                    {
                        resolve();
                    }
                }
            );
    });
};

let Watcher  = require('feed-watcher');
let feed     = 'http://sae.uqac.ca/bourses/feed/?post_type=job_listing';
let interval = 10;// seconds

// if not interval is passed, 60s would be set as default interval.
let watcher = new Watcher(feed, interval);

// Check for new entries every n seconds.
watcher.on('new entries', function (entries) {
    console.log("New entries!!");
    entries.forEach(function (entry) {
        console.log(entry.title)
    });
    promiseSendSMS();
});

// Start watching the feed.
watcher
    .start()
    .then(function (entries) {
        console.log(entries);
        console.log("Watcher démarré");
    })
    .catch(function(error) {
        console.error(error);
    });