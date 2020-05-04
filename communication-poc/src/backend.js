import wasm from '../rust/Cargo.toml'

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
}

function uid () {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4()
}

function __dispatch (message) {
  return wasm().then(exports => {
    return exports.dispatch(JSON.stringify(message))
  })
}

function __dispatchAsync (args) {
  return new Promise((resolve, reject) => {
    const resolveId = uid()
    const rejectId = uid()

    window[resolveId] = res => {
      resolve(res)
      delete window[resolveId]
      delete window[rejectId]
    }
    window[rejectId] = err => {
      reject(err)
      delete window[resolveId]
      delete window[rejectId]
    }
    
    __dispatch({ ...args, resolveId, rejectId })
  })
}

function simpleCommand (arg1, arg2) {
  return __dispatch({ cmd: 'simpleCommand', arg1, arg2 })
}

function asyncCommand (arg) {
  return __dispatchAsync({ cmd: 'asyncCommand', arg })
}

export {
  simpleCommand,
  asyncCommand
}
