var express = require("express");
var app = express();

var dbManage = require("./dbManage.js");
var bodyParser = require("body-parser");
var port = process.env.PORT || 3000;
app.set("view engine", "ejs");

app.use("/public", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var persons = [
  { name: "HAZEM", age: 20 },
  { name: "Oussama", age: 24 },
  { name: "Rafik", age: 21, specification: "black" }
];
var data = [
  { id: 1, username: "HAZEM", items: ["work", "play"] },
  { id: 2, username: "OUSSAMA", items: ["work", "work", "work", "pl"] },
  { id: 3, username: "ZINO", items: ["work", "play PUBG"] },
  { id: 4, username: "YASSINE", items: ["play monopoli", "play COD"] }
];

// gettin to the main page
app.get("/", (req, res) => {
  res.render("authPage", {
    desc: "blah blah blah ",
    name: persons[2].name
  });

  //
});

//getting the list of items
app.get("/items", (req, res) => {
  res.send({
    items: items
  });
});

app.post("/users/:username/addItem", function(req, res) {
  let text = req.body.text;
  let username = req.params.username;
  console.log("addItem req arrived : " + req.url + " data : " + text);

  //add to database
  dbManage.addItem(username, text, function(err, result) {
    res.sendStatus(200);
  });
});

app.delete("/users/:username/delete", function(req, res) {
  let username = req.params.username;
  let text = req.body.text;

  //Deleting from the database
  dbManage.deleteItem(username, text, function(err, result) {
    res.send("request completed");
  });
});

app.get("/users/:username/items", function(req, res) {
  dbManage.getItems(req.params.username, function(err, result) {
    res.send({
      items: result
    });
  });
});

app.get("/users/:username", function(req, res) {
  dbManage.getUser(req.params.username, function(err, result) {
    if (result[0] == undefined) {
      res.sendStatus(404);
    } else {
      res.send({
        username: result[0].username
      });
    }
  });
});
// getting to the authentification page
app.get("/authPage", function(req, res) {
  res.render("authPage.ejs");
});

app.post("/", function(req, res) {
  dbManage.getUser(req.body.username, function(err, result) {
    if (result[0] == undefined) {
      dbManage.addUser(req.body.username, function(err, result) {
        if (err) console.error("error in adding the user to the Database");
      });
    }
    res.render("page.ejs", { username: req.body.username });
  });
});

app.put("/users/:username/editItem", function(req, res) {
  dbManage.editItem(
    req.body.textToEdit,
    req.body.text,
    req.params.username,
    function(err, result) {
      if (err) {
        console.error("error on editing");
        res.sendStatus(404);
      } else res.sendStatus(200);
    }
  );
});

app.put("/users/:username/changeStateItem", function(req, res) {
  dbManage.editState(
    req.params.username,
    req.body.text,
    req.body.checked,
    function(err, result) {
      if (err) res.sendStatus(404);
      res.sendStatus(200);
    }
  );
});

app.listen(port, () => {
  console.log("listening to port : " + port);
});
