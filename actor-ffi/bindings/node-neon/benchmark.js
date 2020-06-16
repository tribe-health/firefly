const lib = require('./lib')
lib.init()
for (let i = 0; i < 100000; i++) {
  lib.sendMessage('message from Node')
    .then(response => {
      console.log(response)
    })
}