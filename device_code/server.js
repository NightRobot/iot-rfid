/*
  server.js
*/
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var request = require('request');
var routes = require('./routes');
var path = require('path');

/*
  database setting
*/
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./hospital.db');


var member = require('./routes/member');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
// app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

// // development only
// if ('development' == app.get('env')) {
//   app.use(express.errorHandler());
// }


app.get('/', routes.index);

app.get('/member', member.search);
app.post('/member', member.result);

app.get('/scan', routes.scan);

app.get('/doctor', routes.doctor);

app.get('/add', member.add);
app.post('/add', member.save);



app.get('/delete/:identificationid', member.delete);
app.get('/edit/:identificationid', member.edit);
app.post('/edit/:identificationid', member.save_edit);

app.get('/list', member.list);
app.get('/listcard', member.listcard);
app.get('/view/:uuid', member.view);
app.get('/delete/view/:uuid', member.delete_view);

// app.get('/input/:uuid', member.input);
app.get('/input/:uuid', (req, res) => {
  var uuid = req.params.uuid;
  console.log("insert card : " + uuid);
  db.serialize(function() {
    var stmt = db.prepare("INSERT INTO card VALUES (?)");
    stmt.run(uuid);
    stmt.finalize();
    console.log("add card complete");
  });
  res.send('request receive');
})

/*
  line webhook

*/
app.post('/webhook', (req, res) => {
  var data = req.body;
  var text = data.events[0].message.text
  var sender = data.events[0].source.userId
  var replyToken = data.events[0].replyToken
  console.log(typeof sender, typeof text)
  console.log(data);
  console.log(data.events[0]);
  var name_pos = text.search("ชื่อ");
  var identificationid_pos = text.search("หมายเลขบัตรประชาชน");
  var symtoms_pos = text.search("อาการ");
  var name = text.substring(5, identificationid_pos-1);
  var identificationid = text.substring(identificationid_pos+19, symtoms_pos-1);
  var symtoms = text.substring(symtoms_pos+6);
  console.log("receive data");
  //เงื่อนไขของ bot
  if (text === 'สวัสดี' || text === 'Hello' || text === 'hello') {
    pushMsg(sender, text)
  } else {
    //  pushMsg(sender, name);
    //  pushMsg(sender, identificationid);
    //  pushMsg(sender, symtoms);
     db.serialize(function() {
       var query = "SELECT * from patient where identificationid='" +identificationid+"'";
       console.log(query);
       db.all(query, function(err, rows) {
         console.log("data"+rows);
         console.log("data"+rows[0]);
         if (rows[0] == undefined) {
           pushMsg(sender, "ไม่พบข้อมูล");
         } else {
           pushMsg(sender, "พบข้อมูล");
           db.run("UPDATE patient set name = '"+name+"' where identificationid='" +identificationid+"'");
           db.run("UPDATE patient set identificationid = '"+identificationid+"' where identificationid='" +identificationid+"'");
           db.run("UPDATE patient set symtoms = '"+symtoms+"' where identificationid='" +identificationid+"'");
         }
       });

     });
  }


  res.sendStatus(200)
})
var access_token = 'cMoITqBXh02CTYraIFcCEx98RUsyJiDwTPl/vf6b79dvr4ZaI+i564XJOE03uBuRcbBQxVHv2XDWT+jDgTCLKRAvGaH/sPHwI9vaxd2q/+Vhp0GDmhwuELQzw0uY3NQ9WlKfD07fArmwm//+kyygNQdB04t89/1O/w1cDnyilFU=';

function pushMsg(sender, text) {
  let data = {
    to: sender,
    messages: [{
      type: 'text',
      text: text
    }]
  }
  request({
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    },
    url: 'https://api.line.me/v2/bot/message/push',
    method: 'POST',
    body: data,
    json: true
  }, function(err, res, body) {
    if (err) console.log('error')
    if (res) console.log('success')
    if (body) console.log(body)
  })

}
app.use("/", express.static(__dirname + "/"));
app.listen(port, function() {
  console.log('server on port 8080');
});
