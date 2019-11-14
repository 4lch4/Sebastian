const config = require('./config')
const inquirer = require('inquirer')
const { green, bold } = require('kleur')

const TogglClient = require('toggl-api')
const toggl = new TogglClient({ apiToken: config.togglApiToken })

module.exports = () => {
  inquirer.prompt([
    {
      type: 'list', name: 'action', message: 'Which task are you shifting to?', choices: [
        'Commuting',
        'At the office',
        'Working from home'
      ]
    }
  ]).then(answers => {
    switch (answers.action) {
      case 'At the office':
        toggl.startTimeEntry({
          description: answers.action,
          pid: config.projectIds.jbHunt,
          billable: true
        }, (err, newEntry) => {
          if (err) console.error(err)
          else {
            console.log(green(`A timer has been started for ${bold(answers.action)} -- Have fun!`))
          }
        })
        break;

      case 'Commuting':
        toggl.startTimeEntry({
          description: answers.action,
          pid: config.projectIds.jbHunt,
          billable: false
        }, (err, newEntry) => {
          if (err) console.error(err)
          else console.log(green(`A timer has been started for ${bold(answers.action)} -- Have fun!`))
        })
        break;

      case 'Working from home':
        toggl.startTimeEntry({
          description: answers.action,
          pid: config.projectIds.jbHunt,
          billable: true
        }, (err, newEntry) => {
          if (err) console.error(err)
          else console.log(green(`A timer has been started for ${bold(answers.action)} -- Have fun!`))
        })
        break;

      default:
        break;
    }
  })
}