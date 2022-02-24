const PORT = 8080;
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const { getUser, getUserByEmail, insertUser, generateRandomString } = require('./helpers');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ["secret", "cookie"]
}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "esdrft": "http://www.yahoo.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {// http://localhost:8080/urls.json
  res.json(urlDatabase);
});

//using urls_index page
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: req.session['user_id']
  };
  res.render("urls_index", templateVars);
});

//adds new urls
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//assigning  shorturls to longurls
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL, user: req.session['user_id'] };
  res.render("urls_show", templateVars);
});

//creating shortUrls
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

// redirects the shortURL to longURL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

// delets urls
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect(`/urls`);
});

//
app.get("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL, user: req.session['user_id'] };
  res.render(`urls_show`, templateVars);
});

//edit => new url => /edit/redirect
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect('/urls');
});

app.get("/login", (req, res) => {
  const user = req.session['user_id'];
  if (!user) {
    return res.render(`urls_login`);
  }
  return res.redirect('/urls');
});

app.get("/register", (req, res) => {
  const user = req.session['user_id'];
  if (!user) {
    return res.render(`urls_register`);
  }
  return res.redirect('/urls');
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUser(email, password);
  if (user) {
    req.session['user_id'] = user.id;
    return res.redirect('/urls');
  } else {
    return res.sendStatus(403);
  }
});

app.post("/register", (req, res) => {
  if (req.body["email"] === '' || req.body["password"] === '') {
    res.status(400);
    return res.send("Email or password field is blank");
  }
  const email = req.body["email"];
  const password = req.body["password"];
  const user = getUserByEmail(email);
  if (!user) {
    const userRandomId = generateRandomString();
    insertUser(userRandomId, email, password);
    req.session["user_id"] = userRandomId;
    return res.redirect("/urls");
  } else {
    return res.sendStatus(400);
  }
});

//
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
