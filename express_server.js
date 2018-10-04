const express = require("express");
const app = express();
const PORT = 8080;
const functions = require('./generateURL'); //importing functions
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extebded: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "01": {
    id: "01",
    email: "random@gmail.com",
    password: "Bobsaget"
  },

  "02": {
    id: "02",
    email: "another_email@gmail.com",
    password: "okaycool"
  }
};

//function for finding if the email is already in use
function findEmail(email){
  for(let key in users){
    if(users[key].email === email){
      return true;
    }
  }
}


app.get("/", (req, res) => {
  res.redirect("/urls/show");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT} !`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req,res) => {
  let templateVar = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index",templateVar);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req,res)=> {
  let templateVar = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id], //grabbing the long url by accesing the id value from the req and params obj
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVar);
});

app.post("/urls", (req,res) => {
  const generateURL = functions.generateRandomString();
  urlDatabase[generateURL] = req.body.longURL; //adding a new key value pairing to url database
  res.redirect(`/urls/${generateURL}`);
});

app.get("/u/:shortURL", (req,res) => {
  let longURL = urlDatabase[req.params.shortURL]; //redirect to the long url from the short url through the req object => params object => and the short url that you get from res.
  res.redirect(longURL);
});

app.post('/urls/:id/delete', (req, res) => {
  console.log(urlDatabase);
  console.log(req.params.id);
  delete urlDatabase[req.params.id]; // this deletes urls
  res.redirect("/urls");
});

app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.LongURL; //this updates urls
  res.redirect("/urls")
});

app.post('/login', (req,res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls");
});

app.post('/logout', (req,res) => {
  res.clearCookie('username');
  res.redirect("/urls");
});

app.get('/register', (req,res) => {
  res.render("register");
});

//creats new user and adds to user data base with a random id
app.post('/register', (req,res) => {
  const generateId = functions.generateRandomString();
  console.log(req.body.email, req.body.password);
  findEmail(req.body.email);
  if(req.body.email === '' || req.body.password === ''){
    res.status(400);
    res.send('Must fill out Email and Password!')
  }else if(findEmail(req.body.email) === true){
    res.status(400);
    res.send('Sorry that email was already taken');
  }else{
    const email = req.body.email;
    const password = req.body.password;
    users[generateId] = {id: generateId, email: email, password: password }
    res.cookie('id', generateId);
    res.redirect("/urls");
  }
});





