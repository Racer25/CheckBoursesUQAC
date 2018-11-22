const config = require("./config");
const nodemailer = require('nodemailer');

//Preparing mail objects
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'charlescousyn@gmail.com',
        pass: config.googlePassword
    }
});

const mailOptions = {
    from: 'charlescousyn@gmail.com', // sender address
    to: config.receivers, // list of receivers
    subject: 'Bourses UQAC (RaspiCharles)!', // Subject line
    html: "<p>Une ou plusieurs bourse(s) viennent d'apparaître sur <a href='http://sae.uqac.ca/bourses/'>http://sae.uqac.ca/bourses/</a> !!</p>"// plain text body
};

//Promise to send mails
let promiseSendMail = function(mailOptions)
{
    return new Promise((resolve, reject) =>
    {
        transporter.sendMail(mailOptions,
            function (err, info)
            {
                if (err)
                {
                    reject(err)
                }
                else
                {
                    resolve(info);
                }
            }
    )});
};


//Watcher config
let Watcher  = require('feed-watcher');
let feed     = 'http://sae.uqac.ca/bourses/feed/?post_type=job_listing';
let interval = config.refreshTimeInSeconds;// seconds

// if not interval is passed, 60s would be set as default interval.
let watcher = new Watcher(feed, interval);

// Check for new entries every n seconds.
watcher.on('new entries', function (entries) {
    console.log("New entries!!");
    entries.forEach(function (entry) {
        console.log(entry.title)
    });
   promiseSendMail(mailOptions)
    .then(console.log)
    .catch(console.error);
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