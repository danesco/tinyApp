const urlDatabase = {
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

const users = {
  "01": {
    id: "01",
    email: "random@gmail.com",
    password: "Bob"
  },

  "02": {
    id: "02",
    email: "another_email@gmail.com",
    password: "cool"
  }
};

//function for returning correct urls
function urlsForUser(id){
  userUrls = {}
  for(let url in urlDatabase){
    if(urlDatabase[url].userId === id){
      userUrls.url = urlDatabase[url];
    }
  }
  return userUrls;
}

console.log(urlsForUser("02"));