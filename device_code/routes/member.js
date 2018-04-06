/*
 * setting database sqlite3
 */
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./hospital.db');

/*
 * list member in database
 */
exports.list = function(req, res) {
  db.serialize(function() {
    db.all("SELECT * FROM patient", function(err, rows) {
      console.log(rows);
      res.render('pages/list', {
        data: rows
      });
    });
  });
};
/*
 * add member in database
 */
exports.add = function(req, res) {
  res.render('pages/addmember', {
    data:0
  });
};

/*Save the customer*/

exports.save = function(req, res) {
  console.log(req.body);
  var input = req.body;
  db.serialize(function() {
    // var stmt = db.prepare("INSERT INTO patient VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
    // stmt.run(input.name, input.uuid, input.lineid, input.identificationid, input.birthdate, input.address, '', '', '', '', '', '');
    // stmt.finalize();
    // "INSERT into table_name(col1,col2,col3) VALUES (val1,val2,val3)"
    db.run("INSERT into patient (name,uuid,lineid,identificationid,birthdate,address) VALUES ('"+input.name+"','"+input.uuid+"','"+input.lineid+"','"+input.identificationid+"','"+input.birthdate+"','"+input.address+"')");
    db.each("SELECT * FROM patient", function(err, rows) {
      console.log("user : " + rows.name, rows.uuid, rows.lineid, rows.identificationid, rows.birthdate, rows.address);
    });
  });
  res.redirect('/list');
};
/*
 * edit member in database
 */
exports.edit = function(req, res) {

  var identificationid = req.params.identificationid;

  console.log(identificationid);
  db.serialize(function() {
    db.all("SELECT * from patient where identificationid=" + identificationid, function(err, rows) {
      console.log(rows[0])
        res.render('pages/edit', {
          data: rows[0]
        });
    });
  });
};

/*
 * save edit member in database
 */
exports.save_edit = function(req, res) {
  console.log(req.body);
  var input = req.body;
  // db.run("CREATE TABLE patient (name TEXT, uuid TEXT,lineid TEXT ,identificationid TEXT,birthdate TEXT,address TEXT,datetime TEXT,department TEXT,doctor TEXT,symtoms TEXT,solutions TEXT,status TEXT)");
  db.serialize(function() {
    db.run("UPDATE patient set name = '"+input.name+"' where identificationid='"+input.identificationid+"'");
    db.run("UPDATE patient set uuid = '"+input.uuid+"' where identificationid='"+input.identificationid+"'");
    db.run("UPDATE patient set lineid = '"+input.lineid+"' where identificationid='"+input.identificationid+"'");
    db.run("UPDATE patient set identificationid = '"+input.identificationid+"' where identificationid='"+input.identificationid+"'");
    db.run("UPDATE patient set birthdate = '"+input.birthdate+"' where identificationid='"+input.identificationid+"'");
    db.run("UPDATE patient set address = '"+input.address+"' where identificationid='"+input.identificationid+"'");
    db.run("UPDATE patient set datetime = '"+input.datetime+"' where identificationid='"+input.identificationid+"'");
    db.run("UPDATE patient set department = '"+input.department+"' where identificationid='"+input.identificationid+"'");
    db.run("UPDATE patient set symtoms = '"+input.symtoms+"' where identificationid='"+input.identificationid+"'");
    db.run("UPDATE patient set solutions = '"+input.solutions+"' where identificationid='"+input.identificationid+"'");
    db.run("UPDATE patient set status = '"+input.status+"' where identificationid='"+input.identificationid+"'");
    db.each("SELECT * FROM patient", function(err, rows) {
      console.log("user : " + rows.name, rows.uuid, rows.lineid, rows.identificationid, rows.birthdate, rows.address);
    });
  });
  res.redirect('/list');
};

/*
 * delete member in database
 */
exports.delete = function(req, res) {
  var identificationid = req.params.identificationid;
  db.serialize(function() {
    db.run("DELETE from patient where identificationid=" +identificationid);
    res.redirect('/list');
  });


};

/*
  function for search member
*/
exports.search = function(req, res) {
  res.render('pages/searchmember');
};
exports.result = function(req, res) {
  console.log(req.body);
  var input = req.body;
  console.log(input.identificationid);
  db.serialize(function() {
    db.all("SELECT * from patient where identificationid='" + input.identificationid+"'", function(err, rows) {
      console.log(rows[0])
      if (rows[0] == undefined) {
        res.redirect('/member');
      } else {
        res.render('pages/memberresult', {
          data: rows[0]
        });
      }
    });
  });

};

/*
 * find card in database
 */
 exports.input = function(req, res){
   var uuid = req.params.uuid;
     console.log("insert card : " + uuid);
     db.serialize(function() {
       var stmt = db.prepare("INSERT INTO card VALUES (?)");
       stmt.run(uuid);
       stmt.finalize();
       console.log("add card complete");
     });
 };
exports.listcard = function(req, res) {
  db.serialize(function() {
    db.all("SELECT * FROM card", function(err, rows) {
      console.log(rows);
      res.render('pages/card', {
        data: rows
      });
    });
  });
};

exports.view = function(req, res) {
  var uuid = req.params.uuid;
  db.serialize(function() {
    db.all("SELECT * from patient where uuid='" + uuid+"'", function(err, rows) {
      console.log(rows)
      if (rows[0] == undefined) {
        res.render('pages/addmember', {
          data:uuid
        });
        console.log("not found!!!");
      } else {
        res.render('pages/memberresult', {
          data: rows[0]
        });
      }
    });
  });

};

exports.delete_view = function(req, res) {
  var uuid = req.params.uuid;
  db.serialize(function() {
    db.run("DELETE from card where uuid='" +uuid+"'");
    res.redirect('/listcard');
  });


};
