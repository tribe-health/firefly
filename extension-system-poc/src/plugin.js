import { getAddress } from './api'
import pluginJson from './plugin.json'

import { writable } from 'svelte/store'

import Button from './components/Button.svelte'
import Text from './components/Text.svelte'
const components = {
  Button,
  Text
}

const permissionStorage = {}

function __mapLayoutItem (item) {
  // transform each event string to its API call
  const events = {}
  if (item.events) {
    for (const event in item.events) {
      const { call, assignTo } = item.events[event]
      events[event] = call in this
        ? () => this[call]().then(r => this.model.update(m => ({ ...m, [assignTo]: r })))
        : () => {
          throw new Error(`${value} is not a valid API function`)
        }
    }
  }

  return {
    ...item,
    component: components[item.component],
    children: item.children && item.children.map(__mapLayoutItem.bind(this)),
    events
  }
}

const PERMISSION_DENIED = 'Permission denied'

export default class Plugin {
  constructor (pluginId) {
    this.pluginId = pluginId
    this.model = writable({})

    this.layout = pluginJson.layout.map(__mapLayoutItem.bind(this))
  }

  /**
   * Checks if the user allows the usage of the API
   * @param {string} apiName the API method name
   * @param {string} message the message to display to the user when prompting for permission
   */
  __checkUserPermission (apiName, message) {
    if (this.__isCorePlugin()) {
      return true
    }

    // TODO ideally, the permission would be stored in a database only when the user checks "remember my choice"
    if (permissionStorage[this.pluginId] && permissionStorage[this.pluginId][apiName] !== void 0) {
      return permissionStorage[this.pluginId][apiName]
    }

    const granted = confirm(message)
    if (!(pluginId in permissionStorage)) {
      permissionStorage[this.pluginId] = {}
    }
    permissionStorage[this.pluginId][apiName] = granted
    return granted
  }

  /**
   * @return {bool} whether this instance's plugin is a core plugin or not
   */
  __isCorePlugin () {
    return this.pluginId.startsWith('@iota/')
  }

  /**
   * an example API that's only available for core plugins
   */
  corePluginOnlyApi () {
    if (this.__isCorePlugin()) {
      return Promise.resolve()
    }
    return Promise.reject(PERMISSION_DENIED)
  }

  /**
   * getAddress public API
   * permission must be granted by the user
   */
  getAddress () {
    if (this.__checkUserPermission('getAddress', `${this.pluginId} wants access to an address. Do you allow it?`)) {
      return getAddress()
    }
    return Promise.reject(PERMISSION_DENIED)
  }
}
