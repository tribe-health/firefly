const lib = require('..')
const assert = require('assert')

describe('binding', () => {
  it('sends a message and gets the response', () => {
    lib.sendMessage('message from Node')
      .then(response => {
        assert.equal(response, 'answer message')
      })
  })
})
