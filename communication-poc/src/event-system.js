const _listeners = {}

function on (eventName, fn) {
  if (!(eventName in _listeners)) {
    _listeners[eventName] = []
  }
  _listeners[eventName].push(fn)
}

function emit (eventName, payload) {
  const handlers = _listeners[eventName] || []
  const _payload = payload && payload.startsWith('{') ? JSON.parse(payload) : payload
  for (const handler of handlers) {
    handler(_payload)
  }
}

export {
  on,
  emit
}
