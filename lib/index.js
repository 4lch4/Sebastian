class Index {
  get config() {
    return require('./config')
  }

  list() {
    const list = new (require('./list'))()
    return list.main()
  }

  shift() {
    const shift = new (require('./shift'))()
    return shift.main()
  }

  exit () {
    setTimeout(() => {
      process.exit(0)
    }, 1000)
  }
}

module.exports = Index