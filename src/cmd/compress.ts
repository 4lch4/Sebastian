import { $ } from 'bun'
import { createArgument, createCommand, createOption } from 'commander'
import { execa } from 'execa'
import { cpus, homedir } from 'os'
import { basename, dirname, join, resolve } from 'path'
import { gray, green, yellow } from 'picocolors'

// #region Types & Constants
/** Resolves to the `~/Media/Pictures/Screenshots/Compressed` directory. */
const DefaultDestPath = join(homedir(), 'Media', 'Pictures', 'Screenshots', 'Compressed')

type CompressCommandOptions = {
  threads: string
  keep: boolean
}
// #endregion Types & Constants

// #region Args & Options
const SourcePathArg = createArgument(
  '<srcPath>',
  'Path to the image or directory of images to compress',
)
  .argParser(value => resolve(value))
  .default(process.cwd())

const DestPathArg = createArgument(
  '[destPath]',
  'Destination directory for the compressed image(s)',
)
  .argParser(value => resolve(value))
  .default(DefaultDestPath)

const ThreadsOption = createOption('-t, --threads <threads>', 'Number of threads to use')
  .default(cpus().length / 2)
  .env('SSC_THREADS')

const KeepOption = createOption('-k, --keep', 'Keep the original file')
  .default(false)
  .env('SSC_KEEP')
// #endregion Args & Options

export const CompressCommand = createCommand('compress')
  .description('Compresses a PNG image, or directory of PNG images, using oxipng.')
  .alias('com')
  .addArgument(SourcePathArg)
  .addArgument(DestPathArg)
  .addOption(ThreadsOption)
  .addOption(KeepOption)
  .action(async (srcPath: string, destPath: string) => {
    const { threads, keep } = CompressCommand.opts<CompressCommandOptions>()
    const cmdArgs = ['--opt', 'max', '--preserve', '--dir', destPath]

    if (!srcPath.endsWith('.png')) {
      console.warn(
        yellow(`[index#runCommand]: "${srcPath}" is not a PNG file, treating as a directory...`),
      )

      cmdArgs.push('--recursive', '--threads', threads)
    }

    console.log(
      gray(`[index#runCommand]: Running command: oxipng ${[...cmdArgs, srcPath].join(' ')}`),
    )

    const { stderr, stdout, exitCode } = await execa('oxipng', [...cmdArgs, srcPath])

    if (exitCode === 0) {
      console.log(
        yellow(
          `[index#runCommand]: Successfully compressed "${basename(srcPath)}" to "${destPath}"`,
        ),
      )

      if (stdout.length > 0) console.log(green(`[index#runCommand]: stdout: ${stdout}`))

      if (keep) {
        console.log(gray(`[index#runCommand]: Keeping original file in "${dirname(srcPath)}"`))
      } else if (srcPath.endsWith('.png')) {
        console.log(yellow(`[index#runCommand]: Removing original file "${srcPath}"`))

        await $`rm ${srcPath}`
      } else console.log(yellow(`[index#runCommand]: Source is a directory, skipping deletion.`))
    } else {
      console.error(
        `[index#runCommand]: Command failed w/ non-zero exit code (${exitCode}), stderr:`,
      )
      console.error(stderr)
    }
  })
