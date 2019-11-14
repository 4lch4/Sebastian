#!/usr/bin/env node

const program = require('commander')

const shift = require('../lib/shift')
const list = require('../lib/list')

program.alias('seb')

program
  .command('shift').alias('s').action(() => shift())
program
  .command('list').alias('l').action(() => list())

program.parse(process.argv)
