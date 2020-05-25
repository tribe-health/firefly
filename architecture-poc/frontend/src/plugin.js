import * as api from './api'

import { writable } from 'svelte/store'

import Button from './components/Button.svelte'
import Text from './components/Text.svelte'
const components = {
  Button,
  Text
}

const permissionStorage = {}

const PERMISSION_DENIED = 'Permission denied'

export default class Plugin {
  constructor (pluginId, pluginJson) {
    this.pluginId = pluginId
    this.model = writable({})

    this.__checkValue('layout', pluginJson.layout, { type: 'array', required: true })
    this.layout = pluginJson.layout.map(item => this.__mapLayoutItem(item))
    this.hooks = pluginJson.hooks || {}
  }

  __checkValue (propName, value, { type, required }, messagePrefix = `Plugin ${this.pluginId}:`) {
    if (required && !value) {
      throw new Error(`${messagePrefix} doesn't have a '${propName}' property`)
    }
    if (value !== void 0 && !(type === 'array' ? Array.isArray(value) : typeof value === type)) {
      throw new Error(`${messagePrefix} ${propName} must be a ${type}`)
    }
  }

  __getCallRunner (callObj) {
    const { call, assignTo, args } = callObj
    return call in this && !call.startsWith('__') ?
      () => this[call].apply(this, args).then(r => {
        if (assignTo) {
          this.model.update(m => ({
            ...m,
            [assignTo]: r
          }))
        }
      }) :
      () => {
        throw new Error(`Plugin ${this.pluginId}: ${call} is not a valid API function`)
      }
  }

  __mapLayoutItem (item) {
    this.__checkValue('component', item.component, { type: 'string', required: true })
    this.__checkValue('children', item.childre, { type: 'array' })
    this.__checkValue('events', item.events, { type: 'object' })
    this.__checkValue('props', item.props, { type: 'object' })

    // transform each event string to its API call
    const events = {}
    if (item.events) {
      for (const event in item.events) {
        const callObj = item.events[event]

        this.__checkValue('call', callObj.call, { type: 'string', required: true }, `Plugin ${this.pluginId}: event ${event}`)
        this.__checkValue('assignTo', callObj.assignTo, { type: 'string' }, `Plugin ${this.pluginId}: event ${event}`)

        events[event] = this.__getCallRunner(callObj)
      }
    }

    if (!(item.component in components)) {
      throw new Error(`Plugin ${this.pluginId}: unknown component ${item.component}`)
    }

    return {
      ...item,
      component: components[item.component],
      children: item.children && item.children.map(this.__mapLayoutItem),
      events
    }
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
    if (!(this.pluginId in permissionStorage)) {
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

  __runHook(hookName) {
    if (hookName in this.hooks) {
      const hook = this.hooks[hookName]
      this.__checkValue('call', hook.call, { type: 'string', required: true }, `Plugin ${this.pluginId}: hook ${hookName}`)
      this.__checkValue('assignTo', hook.assignTo, { type: 'string' }, `Plugin ${this.pluginId}: hook ${hookName}`)
      const runner = this.__getCallRunner(hook)
      runner()
    }
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
   * generateAddress public API
   * permission must be granted by the user
   * 
   * @param {String} seed
   */
  generateAddress (seed) {
    if (this.__checkUserPermission('generateAddress', `${this.pluginId} wants to generate an adress. Do you allow it?`)) {
      return api.generateAddress(seed)
    }
    return Promise.reject(PERMISSION_DENIED)
  }

  /**
   * add node
   * @param {String} uri
   */
  addNode (uri) {
    return api.addNode(uri)
  }

  getNodeInfo () {
    return api.getNodeInfo()
  }
}
