const { users, urlDatabase } = require('./database');

function generateRandomString() {
  const randomString = Math.random().toString(36).substring(2,9);
  return randomString;
}
// eslint-disable-next-line no-unused-vars
function getUserByEmail(email, urlDatabase) {
  for (const key in users) {
    const userEmail = users[key]['email'];
    if (userEmail === email) {
      return users[key];
    }
  }
  return undefined;
}
function insertUser(userRandomId, email, password) {
  users[userRandomId] = {
    id: userRandomId,
    email,
    password
  };
}
function UrlsForUser(urlDatabase, userId) {
  let userUrls = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === userId) {
      userUrls[url] = urlDatabase[url];
    }
  }
  return userUrls;
}

module.exports = { getUserByEmail, insertUser, generateRandomString, UrlsForUser };