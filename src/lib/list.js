const config = require('./config')
const inquirer = require('inquirer')
const { green, bold } = require('kleur')

const TogglClient = require('toggl-api')
const toggl = new TogglClient({ apiToken: config.togglApiToken })

module.exports = () => {
  inquirer.prompt([
    {
      type: 'list', name: 'choice', message: 'What would you like to list/display?', choices: [
        'Current running timer'
      ]
    }
  ]).then(answers => {
    if (answers.choice === 'Current running timer') {
      toggl.getCurrentTimeEntry((err, entry) => {
        if (err) console.error(err)
        else {
          console.log(green(`Title -- ${bold(entry.description)}\nStarting Time -- ${bold(new Date(entry.start).toString())}`))
        }
      })
    }
  })
}
