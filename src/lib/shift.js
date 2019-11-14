const Base = require('./Base')
const inquirer = require('inquirer')

class Shift extends Base {
  async main () {
    try {
      const answers = await inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'Which task are you shifting to?',
        choices: [
          'Commuting',
          'At the office',
          'Working from home'
        ]
      }])

      return new Promise((resolve, reject) => {
        switch (answers.action) {
          case 'At the office':
            this.toggl.startTimeEntry({
              description: answers.action,
              pid: this.config.projectIds.jbHunt,
              billable: true
            }, (err, newEntry) => {
              if (err) {
                this.logger.error(err)
                reject(err)
              } else {
                this.logger.info(this.green(`A timer has been started for ${this.bold(answers.action)} -- Have fun!`))
                resolve(newEntry)
              }
            })
            break

          case 'Commuting':
            this.toggl.startTimeEntry({
              description: answers.action,
              pid: this.config.projectIds.jbHunt,
              billable: false
            }, (err, newEntry) => {
              if (err) {
                this.logger.error(err)
                reject(err)
              } else {
                this.logger.info(this.green(`A timer has been started for ${this.bold(answers.action)} -- Have fun!`))
                resolve(newEntry)
              }
            })
            break

          case 'Working from home':
            this.toggl.startTimeEntry({
              description: answers.action,
              pid: this.config.projectIds.jbHunt,
              billable: true
            }, (err, newEntry) => {
              if (err) {
                this.logger.error(err)
                reject(err)
              } else {
                this.logger.info(this.green(`A timer has been started for ${this.bold(answers.action)} -- Have fun!`))
                resolve(newEntry)
              }
            })
            break

          default:
            reject(new Error('Invalid choice, how did you even get here? 🤔'))
            break
        }
      })
    } catch (err) {
      this.logger.error(err)
      return err
    }
  }
}

module.exports = Shift
