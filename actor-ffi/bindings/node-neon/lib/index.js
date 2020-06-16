var addon = require('../native');

module.exports = {
  init() {
    addon.init()
  },
  sendMessage(message) {
    return new Promise(resolve => {
      addon.sendMessage(message, resolve)
    })
  }
}