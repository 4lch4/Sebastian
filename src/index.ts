#!/usr/bin/env bun

import { program } from 'commander'
import { basename } from 'path'
import pkg from '../package.json'
import { CompressCommand, YTDLCommand, ConvertCommand } from './cmd'

program
  // Remove the @4lch4/ prefix from the name
  .name(basename(pkg.name))
  .description(pkg.description)
  .version(pkg.version)
  .addCommand(ConvertCommand)
  .addCommand(CompressCommand)
  .addCommand(YTDLCommand)
  .alias('seb')
  .parse(process.argv)
