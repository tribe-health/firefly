const { Library, Callback } = require('ffi-napi')
const { join } = require('path')

const lib = Library(join(__dirname, '../c/target/debug/libwallet'), {
  send_message: ['void', ['string', 'pointer']]
})

module.exports = {
  sendMessage (message) {
    return new Promise(resolve => {
      let callback = Callback('void', ['string'], response => {
        resolve(response)
      })

      // Make an extra reference to the callback pointer to avoid GC
      process.on('exit', function () {
        callback
      })

      lib.send_message(message, callback)
    })
  }
}
