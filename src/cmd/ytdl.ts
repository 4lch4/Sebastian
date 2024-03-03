// import { logger } from '@4lch4/backpack'
import { $ } from 'bun'
import { createArgument, createCommand, createOption } from 'commander'
import { execa } from 'execa'
import { resolve } from 'path'
import pc from 'picocolors'
import { createSpinner } from '../utils'

// #region Types
type CommandOptions = {
  url: string
  type: DownloadType
  cookies?: string
  archive?: string
  verbose?: boolean
  thumbnail?: boolean
  description?: boolean
  info?: boolean
}

type DownloadType = 'channel' | 'playlist' | 'video'
// #endregion Types

// #region Arguments & Options
const DownloadType: DownloadType[] = ['channel', 'playlist', 'video']

const URLArgument = createArgument(
  '<url>',
  'The url to the channel, playlist, or video you want to download',
)

/** An optional option that indicates the type of download. */
const URLTypeOption = createOption('-t, --type <type>', 'The type of URL provided')
  .choices(DownloadType)
  .default('video')

/** An option to provide a path to some cookies to use. */
const CookiesOption = createOption(
  '-c, --cookies <path>',
  'The path to the cookies file to use',
).argParser(path => resolve(path))

/** An option to provide a path to the download archive file. */
const ArchiveOption = createOption(
  '-a, --archive <path>',
  'The path to the download archive file',
).argParser(path => resolve(path))

/** An option indicating to log more than usual. */
const VerboseOption = createOption('-v, --verbose', 'Enable verbose logging')

/** An option indicating to download the video thumbnail. */
const ThumbnailOption = createOption(
  '-T, --thumbnail',
  'Download the video thumbnail as well as the video',
)

/** An option indicating to download the video description. */
const DescriptionOption = createOption(
  '-D, --description',
  'Download the video description as well as the video',
)

/** An option indicating to download the video info JSON. */
const InfoOption = createOption('-I, --info', 'Download the video info JSON as well as the video')
// #endregion Arguments & Options

// #region Helper Functions
async function checkYtDlpExists() {
  try {
    const exists = await $`yt-dlp --version`.text()

    if (exists) return true
  } catch (error) {
    console.error(`[checkYtDlpExists] Error caught when checking if yt-dlp exists:`)
    console.error(error)
  }

  return false
}

function getOutputTemplate(type: DownloadType) {
  switch (type) {
    case 'channel':
      return '%(uploader)s/%(playlist)s/%(playlist_index)s.%(fulltitle)s.%(ext)s'
    case 'playlist':
      return '%(uploader)s.%(playlist)s.%(fulltitle)s.%(ext)s'
    case 'video':
      return '%(uploader)s.%(fulltitle)s.%(ext)s'
  }
}

function getCommandArgs(opts: CommandOptions) {
  const outputTemplate = getOutputTemplate(opts.type)
  const commandArgs = ['-o', outputTemplate, '--restrict-filenames']

  if (opts.cookies) commandArgs.push('--cookies', opts.cookies)
  if (opts.archive) commandArgs.push('--download-archive', opts.archive)
  if (opts.verbose) commandArgs.push('--verbose')
  if (opts.thumbnail) commandArgs.push('--write-thumbnail')
  if (opts.description) commandArgs.push('--write-description')
  if (opts.info) commandArgs.push('--write-info-json')

  return commandArgs
}
// #endregion Helper Functions

async function runCommand(url: string) {
  const spinner = createSpinner('Running command...')
  const opts = YTDLCommand.opts<CommandOptions>()

  if (opts.verbose) {
    console.log(pc.yellow(`[YTDLCommand] Running yt-dlp with url: ${url}`))
    console.log(pc.yellow(`[YTDLCommand] Options: ${JSON.stringify(opts)}`))
  } else spinner.start()

  const exists = await checkYtDlpExists()

  if (!exists) {
    console.error(`[YTDLCommand] yt-dlp does not exist, please install it and try again.`)

    process.exit(1)
  }

  const commandArgs = getCommandArgs(opts)

  spinner.text = `Running command: yt-dlp ${commandArgs.join(' ')} '${url}'`

  const { stderr, exitCode } = await execa('yt-dlp', [...commandArgs, url])

  if (exitCode !== 0) {
    console.error(`[YTDLCommand] yt-dlp exited with code ${exitCode}`)
    console.error(`[YTDLCommand] yt-dlp stderr:`)
    console.error(stderr)

    spinner.fail('Command failed')
    process.exit(1)
  }

  spinner.succeed('Video(s) successfully downloaded!')
  process.exit(0)
}

export const YTDLCommand = createCommand('ytdl')
  .description('A wrapper for the yt-dlp tool with my preferences')
  .alias('yt')
  .alias('tw')
  .alias('twitch')
  .addArgument(URLArgument)
  .addOption(URLTypeOption)
  .addOption(CookiesOption)
  .addOption(ArchiveOption)
  .addOption(VerboseOption)
  .addOption(ThumbnailOption)
  .addOption(DescriptionOption)
  .addOption(InfoOption)
  .action(async url => {
    try {
      await runCommand(url)
    } catch (error) {
      console.error(`[YTDLCommand] Error caught when running command:`)
      console.error(error)
    }
  })
