const Base = require('./Base')

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
              this.logger.info(this.green(`Title\t -- ${this.bold(entry.description)}`))
              this.logger.info(this.green(`Starting Time -- ${this.bold(new Date(entry.start).toString())}`))
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

module.exports = List
