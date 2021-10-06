import {Command, flags} from '@oclif/command'
import {createDecipheriv} from 'crypto'

let fs = require('fs')

class Decipher extends Command {
  static description = 'Yet another decipher'

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    key: flags.string({char: 'k', description: 'key'}),
    data: flags.string({char: 'd', description: 'encrypted data'}),
    file: flags.string({char: 'f', description: 'path to file with encrypted data'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Decipher)

    // const key = flags.key
    // const data = flags.data
    // const file = flags.file
    let fileData

    if (!flags.key) {
      this.error('Missing key flag (-k)')
      return
    }
    if (!flags.data && !flags.file) {
      this.error('Missing data (-d) and file (-f) flags. Please provide at least one.')
    }

    let data

    if (flags.file) {
      fileData = fs.readFileSync(flags.file, 'utf8')
      data = fileData.toString()
    }
    if (flags.data) {
      data = flags.data
    }
    const decryptedData = this.decipherData(data, flags.key)
    this.log(decryptedData)
  }

  decipherData(encryptedText: string, key: string): string {
    const decipher = createDecipheriv(
      'aes-256-cbc',
      key,
      Buffer.alloc(16, 0)
    )
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }
}

export = Decipher
