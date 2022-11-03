const chai = require('chai');
const assert = chai.assert;
const findEmail = require('../helpers.js');

const testUsers = {
  "testid1": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "testid2": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  },
};

describe ('#findEmail', () => {
  it('should get the user info with a valid email', () => {
    const user = findEmail("user2@example.com", testUsers)
    const expected = {
      id: "user2RandomID", 
      email: "user2@example.com", 
      password: "dishwasher-funk"
    };
    assert.deepEqual(user, expected);
  })

  it('should get the user info with a valid email', () => {
    const user = findEmail("user@example.com", testUsers)
    const expected = {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    };
    assert.deepEqual(user, expected);
  })

  it('should get null with an invalid email', () => {
    const user = findEmail("user3@example", testUsers)
    const expected = null
    assert.deepEqual(user, expected);
  })

  it('should be able to get the id of a valid email if accessed', () => {
    const user = findEmail("user@example.com", testUsers)
    const expected = "userRandomID"
    assert.deepEqual(user.id, expected);
  })
})