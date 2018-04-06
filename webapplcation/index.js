// server.js
// load the things we need
var express             = require('express');
var app                 = express();
var port                = process.env.PORT || 8080;
const https             = require('https');
var ThingSpeakClient    = require('thingspeakclient');
var client              = new ThingSpeakClient();
var write_key           = "UO0U63SZI95U5351";
var read_key            = "1MWZUL5YKPB8A93D";
var channal_id          = 278957;
var str = '';
var thing_data;
// getdata();
function getdata(){
    https.get('https://api.thingspeak.com/channels/278957/feeds.json?api_key=1MWZUL5YKPB8A93D&results=2', (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
        res.on('data', function (chunk) {
            str += chunk;
            thing_data = str;
            str = '';
        });
    });
}
// set the view engine to ejs
app.set('view engine', 'ejs');
// use res.render to load up an ejs view file
// cover page
app.get('/', function(req, res) {
    res.render('pages/main');
});
app.get('/get/thingdata', function(req, res, next) {
    getdata();
    next()
    res.status(200);
    res.setHeader('Content-type', 'text/xml');
    console.log(thing_data);
    return res.send(thing_data);
});
app.get('/scan', function(req, res) {
    res.render('pages/scan');
});
app.get('/search', function(req, res) {
    res.render('pages/search');
});
app.post('/webhook', (req, res) => {
    res.sendStatus(200)
})
app.use("/",express.static(__dirname + "/"));
app.listen(port, function(){
    console.log('on localhost:8080');
});
