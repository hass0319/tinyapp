const express = require('express');
const bodyParser = require("body-parser");
const { get } = require('express/lib/response');
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({extended: true}));
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
//adding urls to index page
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
  if (!urlDatabase[shortURL]) {
    res.status(400);
    res.send("Url is not in database");
  }
  res.render("urls_show", templateVars);
});
//creating shortUrls
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls`);
});
// redirects the shortURL to longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
// delets urls
app.post("/urls/:shortURL/delete", (req, res) =>{
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect(`/urls`);
});
