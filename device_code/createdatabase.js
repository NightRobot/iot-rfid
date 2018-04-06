/*
  create table for this app
*/
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('hospital.db');

db.serialize(function () {
  db.run("CREATE TABLE patient (name TEXT, uuid TEXT,lineid TEXT ,identificationid TEXT,birthdate TEXT,address TEXT,datetime TEXT,department TEXT,doctor TEXT,symtoms TEXT,solutions TEXT,status TEXT)");
  //create testuser
  var stmt = db.prepare("INSERT INTO patient VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
  stmt.run('test', '12345678', 'line12345678','0','24.0.1992','bangkok', '10.1.2017', 'OPT', 'Stange', 'Headace', 'leave', 'check');
  stmt.finalize();
  // db.run("INSERT into patient (name,uuid,lineuid,identificationid,datetime,department,doctor,symtoms,solutions,status) VALUES ('test', '12345678', 'line12345678', '0', '10.1.2017', 'OPT', 'Stange', 'Headace', 'leave', 'check');
  db.each("SELECT * FROM patient", function (err, row) {
    console.log(Object.keys(row));
    console.log("test user : " + row.name,row.uuid,row.lineuid,row.identificationid,row.datetime,row.department,row.doctor,row.symtoms,row.solutions,row.status);
  });
  db.run("CREATE TABLE card (uuid TEXT)");
  
  var stmt = db.prepare("INSERT INTO card VALUES (?)");
  stmt.run('12345678');
  stmt.finalize();
  // db.run("INSERT into patient (name,uuid,lineuid,identificationid,datetime,department,doctor,symtoms,solutions,status) VALUES ('test', '12345678', 'line12345678', '0', '10.1.2017', 'OPT', 'Stange', 'Headace', 'leave', 'check');
  db.each("SELECT * FROM card", function (err, row) {
    console.log(Object.keys(row));
    console.log("test card : " + row.uuid);
  });
});
db.close();
