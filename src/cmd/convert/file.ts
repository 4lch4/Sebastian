import { createArgument, createCommand } from 'commander'
import { yellow } from 'picocolors'

const FileInfoArgument = createArgument(
  '<file-glob>',
  'Either a path to a file, or a glob to match multiple files, to convert.',
)

/**
 * This command is for converting files from one format to another.
 */
export const ConvertFileCommand = createCommand('file')
  .description('Converts a file, or files matching a glob, from one format to another.')
  .alias('f')
  .addArgument(FileInfoArgument)
  .action((fileGlob: string) => {
    console.log(yellow(`Converting file(s) matching glob: ${fileGlob}`))

    console.log(yellow('The rest of the implementation has not been done yet.'))
  })
