var mysql = require("mysql");
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "TODO"
});
db.connect(err => {
  if (err) console.error(err);
  else console.log("connected to TODO Database ");
});

var getItems = function(username, callback) {
  let query =
    "SELECT * FROM items,users WHERE items.idUser = users.idUser and username = '" +
    username +
    "'";
  db.query(query, function(err, result) {
    callback(err, result);
  });
};

var getidUser = function(username, callback) {
  let query = `select idUser from users where username = '${username}'`;
  db.query(query, function(err, result) {
    if (err) console.error("couldn't get userId from db");
    let userId = result[0].idUser;
    callback(userId);
  });
};

// add an item
var addItem = function(username, text, callback) {
  let idUser;
  getidUser(username, function(idUser) {
    let query = `insert into items (idUser, text, state  ) values ( ${idUser}, '${text}', ${0})`;
    db.query(query, function(err, result) {
      if (err) console.error(err);
      callback(err, result);
    });
  });
};

var editItem = function(textToEdit, text, username, callback) {
  let idUser;
  getidUser(username, function(idUser) {
    let query = `UPDATE items 
    SET text = '${text}' WHERE idUser = ${idUser} AND text = '${textToEdit}' `;
    db.query(query, function(err, result) {
      if (err) console.log("error in dbmanage " + err);
      callback(err, result);
    });
  });

};

var editState = function(username, text, checked, callback) {
  let idUSer;
  getidUser(username, function(idUser) {
    let query2 = `UPDATE items 
             SET state = ${checked}
             WHERE idUser = ${idUser} 
               AND text ='${text}'            
`;
    db.query(query2, function(err, result) {
      if (err) console.error("couldn't get userId from db");
      callback(err, result);
    });
  });
};

//delete an item
var deleteItem = function(username, text, callback) {
  let query = ` DELETE
FROM items
WHERE text = '${text}' AND idUser IN
(SELECT idUser
FROM users
WHERE username = '${username}'   )`;
  db.query(query, function(err, result) {
    if (err) console.error(err);
    callback(err, result);
  });
};

var getUser = function(username, callback) {
  let query = "SELECT * FROM users WHERE username = '" + username + "'";
  db.query(query, function(err, result) {
    callback(err, result);
  });
};
var addUser = function(username, callback) {
  let query = `insert into users(username) values('${username}')`;
  db.query(query, function(err, result) {
    if (err) console.error(err);
    callback(err, result);
  });
};

module.exports = {
  db: db,
  getUser: getUser,
  getItems: getItems,
  addItem: addItem,
  deleteItem: deleteItem,
  addUser: addUser,
  editItem: editItem,
  editState: editState
};
