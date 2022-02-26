const { assert } = require('chai');

const { getUserByEmail, users } = require('../helpers.js');


describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", users);
    const expectedUserID = "userRandomID";
    assert.deepEqual(user.id, expectedUserID);
  });
  it('should return an invalid email', function() {
    const user = getUserByEmail("newuser@example.com", users);
    assert.isUndefined(user);
  });
});