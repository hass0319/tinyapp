const PORT = 8080;
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  const randomString = Math.random().toString(36).substring(2,9);
  return randomString;
}

app.listen(PORT, ()=> {
  console.log(`Example app listening on port ${PORT}!`);
});
app.get("/", (req, res) => {
  res.send("Hello!");
});
//
app.get("/urls.json", (req,res) => {// http://localhost:8080/urls.json
  res.json(urlDatabase);
});
//using urls_index page
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
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
  const templateVars = { shortURL, longURL};
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
  // const shortURL = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
// delets urls
app.post("/urls/:shortURL/delete", (req, res) =>{
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect(`/urls`);
});
//
app.get("/urls/:shortURL/edit", (req, res) =>{
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const  templateVars = {shortURL, longURL};
  res.render(`urls_show`, templateVars);
});
//edit => new url => /edit/redirect
app.post("/urls/:shortURL", (req,res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect('/urls');
});
//
app.post("/login", (req,res) => {
  const username = req.body.username;
  console.log(username);
  res.cookie("username", username);
});
//
app.post("/login", (req,res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});
