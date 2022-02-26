
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

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2a$10$uBWN.OlMM/xrXF96N4BSzeENXrY7nYqxCW9fEeO8QdwJbudP4sMAm"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2a$10$XHBDkt1sGDey8MdxgsSEE.nsNMUBE/VnnqicRY3XeockrrKi6DJSO"
  }
};
function generateRandomString() {
  const randomString = Math.random().toString(36).substring(2,9);
  return randomString;
}
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

module.exports = {users, urlDatabase, getUserByEmail, insertUser, generateRandomString, UrlsForUser};