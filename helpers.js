const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "1234"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "asdf"
  }
};

function generateRandomString() {
  const randomString = Math.random().toString(36).substring(2,9);
  return randomString;
}

function getUser(email, password) {
  for (const key in users) {
    const userEmail = users[key]['email'];
    const userPass = users[key]['password'];
    if (userEmail === email && userPass === password) {
      return users[key];
    }
  }
  return false;
}

function getUserByEmail(email) {
  for (const key in users) {
    const userEmail = users[key]['email'];
    if (userEmail === email) {
      return users[key];
    }
  }
  return false;
}

function insertUser(userRandomId, email, password) {
  users[userRandomId] = {
    id: userRandomId,
    email,
    password
  };
}



module.exports = {getUser, getUserByEmail, insertUser, generateRandomString};