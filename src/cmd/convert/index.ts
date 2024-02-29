import { createCommand } from 'commander'
import { ConvertFileCommand } from './file'

export const ConvertCommand = createCommand('convert')
  .description('Converts assets, such as images or files, from one format to another.')
  .alias('conv')
  .addCommand(ConvertFileCommand)
