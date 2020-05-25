import * as walletLib from 'wallet-lib'
import * as clientLib from 'iota-rs-wasm/web'

/**
 * generateAddress
 *
 * @param {String} seed
 */
function generateAddress (seed) {
  return walletLib.generateAddress(seed)
}

/**
 * add node
 *
 * @param {String} uri URI of IRI connection
 */
function addNode(uri) {
  return clientLib.addNode(uri)
}

/**
 * gets the node info
 */
function getNodeInfo() {
  return clientLib.getNodeInfo()
}

export {
  generateAddress,
  addNode,
  getNodeInfo
}
