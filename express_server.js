const PORT = 8080;
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const { users, getUser, getUserByEmail, insertUser, generateRandomString, UrlsForUser} = require('./helpers');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ["secret", "cookie"]
}));

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};


app.get("/", (req, res) => {
  const user = req.session["user_id"];
  if (!user) {
    res.redirect('/login');
  }
  res.redirect('/urls');
});

//using urls_index page
app.get("/urls", (req, res) => {
  const userId = req.session['user_id'];
  if (!userId) {
    return res.status(400).send('Login to view urls');
  }
  const user = users[userId];
  let userUrls = UrlsForUser(urlDatabase, userId);
  console.log(userUrls);
  const templateVars = { urls: userUrls, user };
  res.render("urls_index", templateVars);
});

//adds new urls
app.get("/urls/new", (req, res) => {
  const user = req.session['user_id'];
  if (!user) {
    res.send('Login to view urls');
    return res.redirect('/login');
  }
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

//assigning  shorturls to longurls
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { shortURL, longURL, user: req.session['user_id'] };
  res.render("urls_show", templateVars);
  // url of id does not exist return error
  // if(!user) return errort
  // if(user), but url ! owned by id breturn error
});

//creating shortUrls
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL,
    userID: req.session["user_id"]
  };
  res.redirect(`/urls/${shortURL}`);
  // if url of is exists, redirects to longurl
  //if !url error
});

// redirects the shortURL to longURL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});


//
app.get("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { shortURL, longURL, user: req.session['user_id'] };
  res.render(`urls_show`, templateVars);
});

//edit => new url => /edit/redirect
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect('/urls');
});
// delets urls
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect(`/urls`);
  // if (user)&& owns url
  // deletes urlDatabase, redirects /urls
  // if (!own url) return url not in database
  // if (!user)
  // returns login to delete
});

app.get("/login", (req, res) => {
  const user = req.session['user_id'];
  const templateVars = {user};
  if (!user) {
    return res.render(`urls_login`, templateVars);
  }
  return res.redirect('/urls');
});

app.get("/register", (req, res) => {
  const user = req.session['user_id'];
  const templateVars = {user};
  if (!user) {
    return res.render(`urls_register`, templateVars);
  }
  return res.redirect('/urls');
});

// console.log(`user=> ${user}, email=> ${email}, password =>${password}`);
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email);
  
  if (!user) {
    return res.status(403).send('Error: Email or Password does not match');
  }
  const result = bcrypt.compareSync(password, user.password);
  if (!result) {
    return res.send(`Error: password don't match`);
  }
  req.session['user_id'] = user.id;
  return res.redirect('/urls');
});

app.post("/register", (req, res) => {
  if (req.body["email"] === '' || req.body["password"] === '') {
    return res.status(400).send("Email or password field is blank");
  }
  const email = req.body["email"];
  const password = req.body["password"];
  const user = getUserByEmail(email);
  const salt = bcrypt.genSaltSync();
  const hashedPassword = bcrypt.hashSync(password, salt);
  if (!user) {
    const userRandomId = generateRandomString();
    insertUser(userRandomId, email, hashedPassword);
    req.session["user_id"] = userRandomId;
    return res.redirect("/urls");
  }
  return res.status(400).send('Error: Email exits');
});

//logs out and clears cookies
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.get("/urls.json", (req, res) => {// http://localhost:8080/urls.json
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
