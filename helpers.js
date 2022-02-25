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

// const getUserByEmail = function(email, database) {
  
//   for (const key in users) {
//     const userEmail = users[key]['email'];
//     const userPass = users[key]['password'];
//     if (userEmail === email) {
//       return users[key];
//     }
//     if(userPass === password){
//       return false
//   }
//   return false;
// }
//   return user;
// };
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

function UrlsForUser(urlDatabase, userId) {
  let userUrls = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === userId) {
      userUrls[url] = urlDatabase[url];
    }
  }
  return userUrls;
}



// function urlDatabase(urlDatabase) {
//   let newDatabase = {};
//   for (let key in urlDatabase) {
//     const shortURL = urlDatabase[key];
//     const longURL = urlDatabase[key].longURL;
//     const userID = urlDatabase[key].userID;
//     newDatabase = {
//       shortURL,
//       longURL,
//       userID
//     };
//   }
//   return newDatabase;
// }


module.exports = {getUser, getUserByEmail, insertUser, generateRandomString, UrlsForUser};