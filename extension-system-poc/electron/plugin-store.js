const fs = require('fs')
const path = require('path')
const electron = require('electron')
const { app } = electron.remote
const https = require('https')

function loadPlugins () {
  const configPath = app.getPath('appData')
  const pluginsPath = path.join(configPath, 'plugins')

  const pluginsData = []
  if (fs.existsSync(pluginsPath)) {
    const plugins = fs.readdirSync(pluginsPath)
    for (const plugin of plugins) {
      const pluginPath = path.join(pluginsPath, plugin)
      if (fs.statSync(pluginPath).isDirectory) {
        const jsonFile = fs.readFileSync(path.join(pluginPath, 'plugin.json')).toString()
        pluginsData.push({
          id: plugin,
          json: JSON.parse(jsonFile)
        })
      }
    }
  }

  return pluginsData
}

function installPlugin (pluginName) {
  const configPath = app.getPath('appData')
  const pluginsPath = path.join(configPath, 'plugins')
  const pluginPath = path.join(pluginsPath, pluginName)
  fs.mkdirSync(pluginPath, { recursive: true })

  return new Promise((resolve, reject) => {
    const request = https.get(`https://raw.githubusercontent.com/lucasfernog/plugin/master/${pluginName}.json`, response => {
      let json = ''

      response.on('data', chunk => {
        json += chunk
      })

      response.on('end', () => {
        fs.writeFileSync(path.join(pluginPath, 'plugin.json'), json)
        resolve(JSON.parse(json))
      })
    })

    request.on('error', reject)
  })
}

module.exports = {
  loadPlugins,
  installPlugin
}
