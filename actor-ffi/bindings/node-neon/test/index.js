const lib = require('../lib')
const assert = require('assert')

describe('binding', () => {
  it('sends a message and gets the response', () => {
    lib.init()
    lib.sendMessage('message from Node')
      .then(response => {
        assert.equal(response, `{ "response": 5 }`)
      })
  })
})