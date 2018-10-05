const express = require("express");
const app = express();
const PORT = 8080;
const functions = require('./generateURL'); //importing functions
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
app.use(cookieParser());

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extebded: true}));

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

var urlDatabase = {
  'b2xVn2': {
    shortURL: "b2xVn2",
    longURL: "http://www.lighthouselabs.ca",
    userId: "01"
  },
  '9sm5xK': {
    shortURL: "9sm5xK",
    longURL: "http://www.google.com",
    userId: "02"
  }
};

var users = {
  "01": {
    id: "01",
    email: "random@gmail.com",
    password: "bob"
  },

  "02": {
    id: "02",
    email: "another_email@gmail.com",
    password: "cool"
  }
};

//function for returning correct urls
function urlsForUser(id){

  let userUrls = {}
  for(let url in urlDatabase){
    console.log(url);
    if(urlDatabase[url].userId === id){
      userUrls[url] = urlDatabase[url];
    }
  }
  //console.log("RETURING USER URLS ", userUrls);
  return userUrls;
}

//function for finding if the email is already in use
function findEmail(email){
  for(let key in users){
    if(users[key].email === email){
      userEmail = email;
    }
  }
  return true;
}

function findPassword(password){
  for(let key in users){
    if(users[key].password === password){
      return true;
    }
  }
}

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT} !`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// app.get("/hello", (req,res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.get("/urls", (req,res) => {
  let updatedDatabase = urlsForUser(req.cookies["user_id"]);
  // console.log("THE USER URLS ",updatedDatabase);

  let templateVar = {
    user: users[req.cookies["user_id"]],
    urls: updatedDatabase
      };
  res.render("urls_index",templateVar);
});

//should redirect to login page if user not logged in
app.get("/urls/new", (req, res) => {
    let templateVar = {
    user: users[req.cookies["user_id"]],
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id], //grabbing the long url by accesing the id value from the req and params obj
  };
  if(req.cookies['user_id'] === undefined){
    res.redirect('/login');
  }else{
    res.render("urls_new", templateVar);
  }
});


// HERE
app.get("/urls/:id", (req,res)=> {
  if(req.cookies["user_id"] === urlDatabase[req.params.id].userId){ //making sure user has access to the url
    let templateVar = {
      urls: urlDatabase,
      user: users[req.cookies["user_id"]],
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id].longURL
    };
    // console.log("HERE: ", urlDatabase[req.params.id].longURL);
    res.render("urls_show", templateVar);
  }else{
    res.status(403);
    res.send('Please log in first!');
  }
});

//creating new short urls
app.post("/urls", (req,res) => {
  const generateURL = functions.generateRandomString();

  urlDatabase[generateURL] = {
    shortURL: generateURL,
    longURL: req.body.longURL,
    userId: req.cookies.user_id
  }
  // console.log("We are in the post urls. After new url:", urlDatabase);
  res.redirect(`/urls/${generateURL}`);
  //res.redirect('/urls');
});

app.get("/u/:shortURL", (req,res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].longURL; //redirect to the long url from the short url through the req object => params object => and the short url that you get from res.
  res.redirect(longURL);
});

app.post('/urls/:id/delete', (req, res) => {
  // console.log(urlDatabase);
  // console.log(req.params.id);
  // console.log(user.id, req.cookies["user_id"]);
  delete urlDatabase[req.params.id]; // this deletes urls
  res.redirect("/urls");
});

app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id].longURL = req.body.LongURL; //this updates urls
  res.redirect("/urls")
});


app.post('/login', (req,res) => {

  let correctUser = false
  for (let user in users) {
    if (users[user].email === req.body.email) {
      correctUser = users[user]
    }
  }
  if (correctUser.password === req.body.password){
    res.cookie('user_id', correctUser.id);
    res.redirect('/');
  }else{
    res.status(403);
    res.send("The email or password you entered is incrorect");
  }

});

app.post('/logout', (req,res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});

app.get('/register', (req,res) => {
  res.render("register");
});

//creats new user and adds to user data base with a random id, if empty or if email already taken returns error
app.post('/register', (req,res) => {
  const generateId = functions.generateRandomString();
  findEmail(req.body.email);
  if(req.body.email === '' || req.body.password === ''){
    res.status(400);
    res.send('Must fill out Email and Password!')
  }else if(findEmail(req.body.email) === true){
    res.status(400);
    res.send('Sorry that email was already taken');
  }else{
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 10);
    users[generateId] = {id: generateId, email: email, password: password }
    res.cookie('user_id', generateId);
    res.redirect("/urls");
  }
  // console.log(users);
});

//create a get login that returns a new login page
app.get('/login', (req,res) => {
  let templateVars= {
    user: users[req.cookies["id"]],
    urls: urlDatabase
  }
  res.render('login', templateVars);
});






