import initWasm, * as wasm from './wasm-web/wallet_lib'
let __initializedWasm = false

function __getClient () {
  if (__initializedWasm) {
    return Promise.resolve(wasm)
  }
  return initWasm('wallet_lib.wasm').then(() => {
    __initializedWasm = true
    return wasm
  })
}

/**
 * @param {String} seed
 */
function generateAddress (seed) {
  return __getClient().then(client => client.generateAddress(seed))
}

export {
  generateAddress
}