const program = require('commander')
const inquirer = require('inquirer')
const { cyan, green, magenta, red, yellow } = require('kleur')

const shift = require('../lib/shift')

program.alias('seb')

program
  .command('shift')
  .alias('s')
  .action(() => shift())

program.parse(process.argv)

// console.log(blue('blue...'))
// console.log(cyan('Cyan...'))
// console.log(green('Green...'))
// console.log(magenta('Magenta...'))
// console.log(red('Red...'))
// console.log(strikethrough('Strikethrough...'))
// console.log(underline('Underline...'))
// console.log(white('White...'))
// console.log(yellow('Yellow...'))
