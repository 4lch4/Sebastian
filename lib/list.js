const Base = require('./Base')

const boxen = require('boxen')

class List extends Base {
  async main() {
    try {
      const answers = await this.inquirer.prompt([
        {
          type: 'list',
          name: 'choice',
          message: 'What would you like to list/display?',
          choices: [
            'Current running timer'
          ]
        }
      ])

      if (answers.choice === 'Current running timer') {
        return new Promise((resolve, reject) => {
          this.toggl.getCurrentTimeEntry((err, entry) => {
            if (err) {
              this.logger.error(err)
              reject(err)
            } else if (entry) {
              console.log(boxen(this.green(`--- ${this.bold(entry.description)} ---\n\n${this.bold(todaysDate(entry.start))}`), { padding: 1, align: "center" }))
              resolve(entry)
            } else {
              this.logger.info(this.magenta('There is no timer currently running.'))
              resolve(null)
            }
          })
        })
      }
    } catch (err) {
      this.logger.error(err)
      return err
    }
  }
}

const todaysDate = start => {
  const today = new Date(start)
  return `${today.getFullYear()}/${today.getMonth()}/${today.getDate()} @ ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
}

module.exports = List
