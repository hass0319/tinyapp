const PORT = 8080;
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const { getUserByEmail, insertUser, generateRandomString, UrlsForUser} = require('./helpers');
const { users, urlDatabase } = require('./database');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ["secret", "cookie"]
}));

app.get("/", (req, res) => {
  const user = req.session["user_id"];
  if (!user) {
    return res.redirect('/login');
  }
  return res.redirect('/urls');
});

//using urls_index page
app.get("/urls", (req, res) => {
  const userId = req.session['user_id'];
  let errorMsg = 'Login to view urls';
  let templateVars = { };
  if (!userId) {
    templateVars = { user: null, errorMsg };
    return res.render("urls_login", templateVars);
  }

  const user = users[userId];
  let userUrls = UrlsForUser(urlDatabase, userId);
  templateVars = { urls: userUrls, user };
  return res.render("urls_index", templateVars);
});

//adds new urls
app.get("/urls/new", (req, res) => {
  const userId = req.session['user_id'];
  const user = users[userId];
  const errorMsg = 'Login to create short-URLs urls';
  let templateVars = { };
  if (!userId) {
    templateVars = { user, errorMsg };
    return res.render("urls_login", templateVars);
  }
  templateVars = { user };
  return res.render("urls_new", templateVars);
});

//assigning  shorturls to longurls
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!Object.keys(urlDatabase).includes(shortURL)) {
    return res.status(400).send('URL does not exist');
  }
  const userId = req.session['user_id'];
  const user = users[userId];
  console.log('****', shortURL);
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { shortURL, longURL, user };
  return res.render("urls_show", templateVars);
});

//shows user shortUrls
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL,
    userID: req.session["user_id"]
  };
  return res.redirect(`/urls/${shortURL}`);
});

// redirects to the shortURL of longURL
app.get("/u/:shortURL", (req, res) => {
  const userId = req.session['user_id'];
  const shortURL = req.params.shortURL;
  if (!Object.keys(urlDatabase).includes(shortURL)) {
    return res.status(400).send('URL does not exist');
  }
  const ownerofURL = UrlsForUser(urlDatabase, userId);
  if (!Object.keys(ownerofURL).length) return res.status(400).send('URL not owned');
  const longURL = urlDatabase[shortURL].longURL;
  return res.redirect(longURL);
});

//redirects to the edit of longURL
app.get("/urls/:shortURL/edit", (req, res) => {
  const userId = req.session['user_id'];
  const user = users[userId];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { shortURL, longURL, user };
  return res.render(`urls_show`, templateVars);
});

//edit => new url => /edit/redirect
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
  return res.redirect('/urls');
});

// delets urls
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  return res.redirect(`/urls`);
});

// shows login
app.get("/login", (req, res) => {
  const user = req.session['user_id'];
  let errorMsg = null;
  const templateVars = {user, errorMsg};
  if (!user) {
    return res.render(`urls_login`, templateVars);
  }
  return res.redirect('/urls');
});

// shows reqistration
app.get("/register", (req, res) => {
  const user = req.session['user_id'];
  const templateVars = {user};
  if (!user) {
    return res.render(`urls_register`, templateVars);
  }
  return res.redirect('/urls');
});

// gets user email and password to login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, urlDatabase);
  let errorMsg = 'Error: Email not registered';
  let templateVars = { user, errorMsg };
  if (!user) {
    errorMsg = 'Error: Email or Password does not match';
    return res.render("urls_login", templateVars);
  }
  const result = bcrypt.compareSync(password, user.password);
  if (!result) {
    errorMsg = `Error: password doesn't match`;
  }
  req.session['user_id'] = user.id;
  return res.redirect('/urls');
});

// adds a new user, hashes password,
app.post("/register", (req, res) => {
  if (req.body["email"] === '' || req.body["password"] === '') {
    return res.status(400).send("Email or password field is blank");
  }
  const email = req.body["email"];
  const password = req.body["password"];
  const user = getUserByEmail(email,  urlDatabase);
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
  return res.redirect("/login");
});

app.get("/urls.json", (req, res) => {// http://localhost:8080/urls.json
  return res.json(urlDatabase);
});
// to test server if running
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
