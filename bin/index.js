#!/usr/bin/env node
const program = require('commander')
const lib = new (require('../lib'))

program.version(lib.config.appVersion)

program.command('shift').alias('s').action(() => {
  lib.shift()
  lib.exit()
})

program.command('list').alias('l').action(() => {
  lib.list()
  lib.exit()
})

program.parse(process.argv)

/*
function myParseInt(value, dummyPrevious) {
  // parseInt takes a string and an optional radix
  return parseInt(value);
}

function increaseVerbosity(dummyValue, previous) {
  return previous + 1;
}

function collect(value, previous) {
  return previous.concat([value]);
}

function commaSeparatedList(value, dummyPrevious) {
  return value.split(',');
}

program
  .option('-f, --float <number>', 'float argument', parseFloat)
  .option('-i, --integer <number>', 'integer argument', myParseInt)
  .option('-v, --verbose', 'verbosity that can be increased', increaseVerbosity, 0)
  .option('-c, --collect <value>', 'repeatable value', collect, [])
  .option('-l, --list <items>', 'comma separated list', commaSeparatedList)
*/
