const TogglClient = require('toggl-api')
const { green, bold, magenta } = require('kleur')
const config = require('./config')
const { join } = require('path')
const fs = require('fs')

const logsDir = join(__dirname, '..', '..', 'logs')
const Logger = require('simple-node-logger')
const logManager = new Logger()

class Base {
  constructor (apiToken = process.env.TOGGL_API_TOKEN) {
    this.toggl = new TogglClient({ apiToken: apiToken })
    this.inquirer = require('inquirer')
    this.apiToken = apiToken
    this.config = config

    // Verify the logs directory exists, otherwise, make it.
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir)

    // Create the Console/Rolling File appenders.
    logManager.createConsoleAppender()
    logManager.createRollingFileAppender({
      logDirectory: './logs',
      fileNamePattern: 'roll-<DATE>.log',
      dateFormat: 'YYYY.MM.DD'
    })

    // Instantiate the logger.
    this.logger = logManager.createLogger()
  }

  magenta (input) { return magenta(input) }
  green (input) { return green(input) }
  bold (input) { return bold(input) }
}

module.exports = Base
