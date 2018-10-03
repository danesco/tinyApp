const express = require("express");
const app = express();
const PORT = 8080;
const functions = require('./generateURL'); //importing functions

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extebded: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT} !`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req,res) =>{
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req,res) => {
  let templateVar = {
    urls: urlDatabase
  };
  res.render("urls_index",templateVar);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req,res)=>{
  let templateVar = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id] //grabbing the long url by accesing the id value from the req and params obj
  };
  res.render("urls_show", templateVar);
});

app.post("/urls", (req,res) => {
  const generateURL = functions.generateRandomString();
  urlDatabase[generateURL] = req.body.longURL; //adding a new key value pairing to url database
  res.redirect(`/urls/${generateURL}`);
});

app.get("/u/:shortURL", (req,res) =>{
  let longURL = urlDatabase[req.params.shortURL]; //redirect to the long url from the short url through the req object => params object => and the short url that you get from res.
  res.redirect(longURL);
});

app.post('/urls/:id/delete', (req, res) =>{
  console.log(urlDatabase);
  console.log(req.params.id);
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});








