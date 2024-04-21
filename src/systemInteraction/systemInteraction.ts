import clipboard from 'clipboardy'

function copyToClipboard(string: string) {
  clipboard.writeSync(string)
  // eslint-disable-next-line no-console
  console.log('Copied to clipboard:', string)
}

export { copyToClipboard }
